// Function to form GitHub API URLs for the PRs
const extractPRData = (prBody) => {
  const lines = prBody.trim().split('\n');
  /**
   * ^-\s*                        : Match a dash followed by optional whitespace at the start of the line
   * (https:\/\/github\.com\/     : Match the GitHub URL prefix and capture the whole URL
   * ([^\/]+)\/                   : Capture the repository owner (one or more non-slash characters)
   * ([^\/]+)\/                   : Capture the repository name (one or more non-slash characters)
   * pull\/(\d+))                 : Capture the pull request number (one or more digits)
   * (?:\s*:\s*(.*))?             : Optionally match a colon followed by optional whitespace and capture if any description after the pr
   */
  const prLinkMatchExp =
    /^-\s*(https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+))(?:\s*:\s*(.*))?$/;

  return lines
    .filter((line) => prLinkMatchExp.test(line.trim().replace(/(^'|'$)/g, '')))
    .map((line) => {
      line = line.trim().replace(/(^'|'$)/g, '');
      const [_, prLink, owner, repo, prNumber] = line.match(prLinkMatchExp);
      return { owner, repo, prNumber };
    });
};

// Function to fetch PR details using Octokit
const fetchPRDetails = async (prData, octokit) => {
  const promises = prData.map(({ owner, repo, prNumber }) =>
    octokit.pulls.get({ owner, repo, pull_number: prNumber })
  );

  const result = await Promise.allSettled(promises);
  return result
    .filter((e) => e.status === 'fulfilled')
    .map((e) => e.value.data);
};

// Function to prepare a map of PR numbers to titles
const preparePRTitleMap = async (prBody, octokit) => {
  const prData = extractPRData(prBody);
  const prDetails = await fetchPRDetails(prData, octokit);

 return prDetails.reduce((pv, { number, title }) => {
    pv[number] = title;
    return pv;
  }, {});
};

// Function to parse text and convert it into Slack blocks
const parseTextToSlackBlocks = async (inputText, octokit) => {
  const prNumberTitleMap = await preparePRTitleMap(inputText, octokit);
  const prLinkRegex =
    /^-\s*(https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+))(?:\s*:\s*(.*))?$/;
  const mdLinkRegex = /^(.+)\[([\w+]+)\]\((.+)\)/gi;
  const unorderedListRegex = /^\s*[-+*]\s+(.*$)/gim;
  const orderedListRegex = /^\s*(\d+)\.\s+(.*$)/gim;

  let slackBlocks = [];

  // Process each line of input text
  inputText
    .trim()
    .split('\n')
    .forEach((line) => {
      line = line.trim().replace(/(^'|'$)/g, ''); // Remove leading and trailing quotes

      const prLinkMatch = line.match(prLinkRegex);
      const mdLinkMatch = line.match(mdLinkRegex);

      /**  
       * Replace the MD Link format to Slack link format 
       * Ex:
       *  MD format: - [Link](https://www.adobe.com/)
       *  Slack format: - <https://www.adobe.com/|Link> 
       **/ 
      if (mdLinkMatch) line = line.replace(mdLinkRegex, '$1 <$3|$2>');
      // Convert unordered lists
      line = line.replace(unorderedListRegex, '\t• $1');
      // Convert ordered lists
      line = line.replace(orderedListRegex, '\t$1. $2');
      // Convert the Bold block
      line = line.replace(/\*\*(.*?)\*\*/gim, '*$1*');

      if (line === '') {
        slackBlocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: '\n' },
        });
        return;
      }

      if (prLinkMatch) {
        const [_, prLink, owner, repo, prNumber, lineDescription] = prLinkMatch;
        const prTitle = prNumberTitleMap[prNumber];
        slackBlocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\t• :merged: <${prLink}|*${prTitle}* #${prNumber}>${
              lineDescription ? ' - ' + lineDescription : ''
            }`,
          },
        });
        return;
      }

      if (line.startsWith('### ')) {
        slackBlocks.push({
          type: 'header',
          text: {
            type: 'plain_text',
            text: line.replace('### ', ''),
            emoji: true,
          },
        });
        slackBlocks.push({
          type: 'divider',
        });
        return;
      }

      slackBlocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: line },
      });
    });

  return slackBlocks;
};

module.exports = {
  parseTextToSlackBlocks,
};
