const sendSlackNotification = async (slackMessage, slack_webhook_url) => {
  console.log("slackMessage", slackMessage);
  const result = await fetch(slack_webhook_url, {
    method: "POST",
    body: JSON.stringify(slackMessage),
  }).catch(console.error);
  console.log("API Response", result);
  return result;
};

module.exports = sendSlackNotification;
