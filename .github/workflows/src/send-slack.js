const { parseTextToSlackBlocks } = require("./helpers");

// Those env variables are set by an github action automatically
const [owner, repo]=process.env.GITHUB_REPOSITORY?.split('/') || '';
const auth = process.env.GH_TOKEN;

/**
 * Function to send Slack message
 * @param {string} prNumber - PR number
 * @param {string} slackWebHookURL - Slack webhook URL
 * @returns {Promise} - Promise representing the result of the Slack message sending process
 */
const sendReleaseNotes = async (prNumber, slackWebHookURL) => {
  console.log({ owner, repo, pr_number: prNumber });
  try {
    prNumber = parseInt(prNumber);
    const { Octokit } = await import("@octokit/rest");
    const octokit = new Octokit({ auth });
    const { status, data } = await octokit.pulls.get({
      pull_number: prNumber,
      owner,
      repo,
    });
    if (status !== 200) throw new Error("Cannot fetch the PR details");

    const { html_url, title, body } = data;
    const formattedBodyBlocks = await parseTextToSlackBlocks(body, octokit);
    const titleBlocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: ":rocket: Production Release",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${html_url}| *#${prNumber}: ${title}*>`,
        },
      },
    ];

    const slackBodyBlocks = {
      blocks: [...titleBlocks, ...formattedBodyBlocks],
    };
    console.log("PR Number", prNumber);
    console.log("Message", slackBodyBlocks);

    // Send message to Slack webhook
    const result = await fetch(slackWebHookURL, {
      method: "POST",
      body: JSON.stringify(slackBodyBlocks),
      headers: {
        "Content-type": "application/json",
      },
    }).catch(console.error);
    if (result.status === 200) console.log("Slack Message sent");
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = { sendReleaseNotes };
