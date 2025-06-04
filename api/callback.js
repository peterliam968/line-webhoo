'use strict';

import { middleware, Client } from '@line/bot-sdk';

// LINE config
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// LINE Client
const client = new Client(config);

// 禁用 bodyParser，保留原始 body 給 middleware 用
export const configApi = {
  api: {
    bodyParser: false,
  },
};

// handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // middleware 處理
  const runMiddleware = (req, res, fn) =>
    new Promise((resolve, reject) => {
      fn(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });

  try {
    // Run LINE middleware，讓 req.body 變成可用的 LINE 事件
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
    console.error('Error:', err);
    res.status(500).end();
  }
}
