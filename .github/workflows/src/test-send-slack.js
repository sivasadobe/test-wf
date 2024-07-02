const { sendReleaseNotes } = require("./send-slack.js");
const { parseTextToSlackBlocks } = require("./helpers.js");

const pr_number = 24;
const SLACK_WH_URL =process.env.SLACK_WH_URL;

const main = async () => {
  try {
    const data = await sendReleaseNotes(pr_number,SLACK_WH_URL);
    console.log({ data });
  } catch (e) {
    console.log(e);
  }
};
main();
