const { sendReleaseNotes } = require("./send-slack.js");
const { parseTextToSlackBlocks } = require("./helpers.js");

const pr_number = 24;
const SLACK_WH_URL =
  "https://hooks.slack.com/services/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";

const main = async () => {
  try {
    const data = await sendReleaseNotes(pr_number,SLACK_WH_URL);
    console.log({ data });
  } catch (e) {
    console.log(e);
  }
};
main();
