const { convertMarkdownToSlackFormat } = require("./helpers");

const sendSlackMessage = async (event_pr, slack_webhook_url) => {
  event_pr = JSON.parse(event_pr);
  const { number, html_url, title, body } = event_pr;

  console.log({
    event_pr,
    number,
    html_url,
    title,
    body,
    env_pr: process.env.EVENT_PR,
  });

  const text = `:rocket: *Production Release*\n\n*Title:* ${title} | <${html_url}|#${number}>\n*PR Description:*\n ${convertMarkdownToSlackFormat(
    body
  )}`;
  console.log("text", text);

  const result = await fetch(slack_webhook_url, {
    method: "POST",
    body: JSON.stringify({ text }),
  }).catch(console.error);
  return result;
};

module.exports = sendSlackMessage;
