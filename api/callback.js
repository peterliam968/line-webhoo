'use strict';

const line = require('@line/bot-sdk');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  try {
    const events = req.body.events;

    const results = await Promise.all(
      events.map(async (event) => {
        if (event.type !== 'message' || event.message.type !== 'text') {
          return Promise.resolve(null);
        }

        const echo = { type: 'text', text: event.message.text };

        await client.replyMessage(event.replyToken, [echo]);
      })
    );

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}
