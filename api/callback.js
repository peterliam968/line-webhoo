'use strict';

import { middleware, Client } from '@line/bot-sdk';

// for Vercel → disable bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

// LINE Bot config
const configLine = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// Create LINE client
const client = new Client(configLine);

// LINE middleware
const lineMiddleware = middleware(configLine);

// API Route
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  lineMiddleware(req, res, async () => {
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
  });
}
