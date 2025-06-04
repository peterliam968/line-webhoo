import { middleware, Client } from '@line/bot-sdk';

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const runMiddleware = (req, res, fn) =>
    new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) return reject(result);
        return resolve(result);
      });
    });

  try {
    await runMiddleware(req, res, middleware(config));

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
    console.error('LINE Webhook Error:', err);
    res.status(500).end();
  }
}
