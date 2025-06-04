import { Client, middleware } from '@line/bot-sdk';
export const config = { runtime: 'nodejs' };

const configLine = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(configLine);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
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
    console.error('Error:', err);
    res.status(500).end();
  }
}
