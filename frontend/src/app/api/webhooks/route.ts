import { NextRequest, NextResponse } from 'next/server';

// ダミーWebhookイベントデータ
const dummyWebhooks = [
  {
    id: 'wh1',
    pspEventId: 'komoju_evt_123456',
    eventType: 'payment.succeeded',
    processed: true,
    processedAt: '2025-08-30T11:31:00Z',
    createdAt: '2025-08-30T11:30:30Z',
    rawData: '{"id":"komoju_evt_123456","type":"payment.succeeded","data":{"id":"komoju_pay_123456","amount":2000}}'
  },
  {
    id: 'wh2',
    pspEventId: 'komoju_evt_789012',
    eventType: 'payment.failed',
    processed: true,
    processedAt: '2025-08-30T12:16:00Z',
    createdAt: '2025-08-30T12:15:45Z',
    rawData: '{"id":"komoju_evt_789012","type":"payment.failed","data":{"id":"komoju_pay_789012","amount":3500}}'
  },
  {
    id: 'wh3',
    pspEventId: 'komoju_evt_345678',
    eventType: 'refund.succeeded',
    processed: true,
    processedAt: '2025-08-29T15:31:00Z',
    createdAt: '2025-08-29T15:30:15Z',
    rawData: '{"id":"komoju_evt_345678","type":"refund.succeeded","data":{"id":"komoju_ref_111222","amount":2000}}'
  },
  {
    id: 'wh4',
    pspEventId: 'komoju_evt_999888',
    eventType: 'payment.succeeded',
    processed: false,
    createdAt: '2025-08-30T17:00:00Z',
    rawData: '{"id":"komoju_evt_999888","type":"payment.succeeded","data":{"id":"komoju_pay_999888","amount":1500}}'
  }
];

export async function GET() {
  // API遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json({ webhooks: dummyWebhooks });
}
