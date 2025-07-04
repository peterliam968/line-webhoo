import { middleware, Client } from '@line/bot-sdk';

const lineConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(lineConfig);

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
    await runMiddleware(req, res, middleware(lineConfig));

    const events = req.body.events;

    const results = await Promise.all(
      events.map(async (event) => {
        // 這裡！log 出 event 給你看！
        console.log('👉 event:', JSON.stringify(event, null, 2));

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
