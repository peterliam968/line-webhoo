'use strict';

import { Client } from '@line/bot-sdk';

// 多 user 支援 → 你可以放多個 userId
const userIds = [
  'U8b0cd3da050229f39e0bcad3040c6ee2', // 你現在的 userId
  // 'Uxxxxxxxxxxxxxx', // 其他 userId 可加進來
];

const client = new Client({
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const price = req.query.price || '未知';
    const msg = req.query.msg || '無特別說明';
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // --- 選擇發 Flex 還是純文字 ---
    const useFlex = true; // ← 改 true / false → 控制是否用 Flex message

    // --- 純文字訊息 ---
    const textMessage = {
      type: 'text',
      text: `🚀 [Smart Predict X] 聯亞光電 ${price} 元，${msg}！📈\n🕑 ${timestamp}`,
    };

    // --- Flex message 設計 ---
    const flexMessage = {
      type: 'flex',
      altText: `🚀 [Smart Predict X] 聯亞光電 ${price} 元，${msg}！📈`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '🚀 [Smart Predict X] 聯亞光電',
              weight: 'bold',
              size: 'lg',
              color: '#1DB446',
            },
            {
              type: 'text',
              text: `價格：${price} 元`,
              size: 'md',
            },
            {
              type: 'text',
              text: `訊號：${msg}`,
              size: 'md',
            },
            {
              type: 'text',
              text: `時間：${timestamp}`,
              size: 'sm',
              color: '#999999',
            },
          ],
        },
      },
    };

    // --- 決定要發的 message ---
    const message = useFlex ? flexMessage : textMessage;

    // --- 推播開始 ---
    await Promise.all(userIds.map((uid) => client.pushMessage(uid, message)));

    // --- 紀錄 log ---
    console.log(`[推播 LOG] ${timestamp} → 價格 ${price} 元 → ${msg}`);

    // 回應 API 成功
    res.status(200).json({
      success: true,
      message: '推播成功 ✅',
      pushedPrice: price,
      note: msg,
      timestamp: timestamp,
      targetUsers: userIds.length,
    });
  } catch (err) {
    console.error('❌ 推播失敗：', err);
    res.status(500).json({ success: false, error: err.toString() });
  }
}
