'use strict';

import { Client } from '@line/bot-sdk';

const client = new Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const userId = 'U8b0cd3da050229f39e0bcad3040c6ee2'; // 你的 userId
    const price = req.query.price || '未知';
    const msg = req.query.msg || '無特別說明';

    const message = {
      type: 'text',
      text: `🚀 [Smart Predict X] 聯亞光電 ${price} 元，${msg}！📈`,
    };

    await client.pushMessage(userId, message);

    res.status(200).json({ success: true, message: '推播成功 ✅', pushedPrice: price, note: msg });
  } catch (err) {
    console.error('❌ 推播失敗：', err);
    res.status(500).json({ success: false, error: err.toString() });
  }
}
