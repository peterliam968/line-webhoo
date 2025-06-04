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
    const price = req.query.price || '未知'; // 從 URL 參數讀 price

    const message = {
      type: 'text',
      text: `🚀 [Smart Predict X] 聯亞光電目前價格 ${price} 元，請關注突破行情！`,
    };

    await client.pushMessage(userId, message);

    res.status(200).json({ success: true, message: '推播成功 ✅', pushedPrice: price });
  } catch (err) {
    console.error('❌ 推播失敗：', err);
    res.status(500).json({ success: false, error: err.toString() });
  }
}
