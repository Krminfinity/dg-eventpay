import { NextRequest, NextResponse } from 'next/server';

// ダミー返金データ
const dummyRefunds = [
  {
    id: 'ref1',
    paymentId: 'pay3',
    pspRefundId: 'komoju_ref_111222',
    amount: 2000,
    currency: 'JPY',
    status: 'succeeded',
    reason: 'イベント参加キャンセルのため',
    createdAt: '2025-08-29T15:30:00Z',
    payment: {
      pspPaymentId: 'komoju_pay_345678'
    }
  },
  {
    id: 'ref2',
    paymentId: 'pay1',
    pspRefundId: 'komoju_ref_333444',
    amount: 1000,
    currency: 'JPY',
    status: 'pending',
    reason: '部分返金（一部サービス提供できず）',
    createdAt: '2025-08-30T16:45:00Z',
    payment: {
      pspPaymentId: 'komoju_pay_123456'
    }
  }
];

export async function GET() {
  // API遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json({ refunds: dummyRefunds });
}
