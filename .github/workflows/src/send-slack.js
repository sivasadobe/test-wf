const { convertMarkdownToSlackFormat } = require("./helpers");

const sendSlackMessage = async (event_pr, slack_webhook_url) => {
  const { number, html_url, title, body } = event_pr;

  console.log({ number, html_url, title, body });

  const text = `:rocket: *Production Release*\n*Title:* ${title} | <${html_url}|#${number}>\n*PR Description:* ${convertMarkdownToSlackFormat(
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
