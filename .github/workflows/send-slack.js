const sendSlackNotification = (slackMessage, slack_webhook_url) => {
  return fetch(slack_webhook_url, {
    method: "POST",
    body: JSON.stringify(slackMessage),
  }).catch(console.error);
};

export default sendSlackNotification;
