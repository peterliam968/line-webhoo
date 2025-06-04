'use strict';

const line = require('@line/bot-sdk');

const client = new line.Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

// ⚠️ 把這裡換成你自己的 userId
const userId = '<YOUR_USER_ID>';

client.pushMessage(userId, {
  type: 'text',
  text: '🚀 3081 聯亞光電突破 5%，目前主力集中度 +15%',
})
.then(() => {
  console.log('Push message sent!');
})
.catch((err) => {
  console.error('Push message failed:', err);
});
