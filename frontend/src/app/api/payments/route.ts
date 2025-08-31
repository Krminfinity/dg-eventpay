import { NextRequest, NextResponse } from 'next/server';

// ダミー決済データ
const dummyPayments = [
  {
    id: 'pay1',
    paymentIntentId: 'pi1',
    pspPaymentId: 'komoju_pay_123456',
    amount: 2000,
    currency: 'JPY',
    status: 'succeeded',
    createdAt: '2025-08-30T11:30:00Z',
    paymentIntent: {
      eventId: '1',
      rsvpId: 'rsvp1'
    }
  },
  {
    id: 'pay2',
    paymentIntentId: 'pi2',
    pspPaymentId: 'komoju_pay_789012',
    amount: 3500,
    currency: 'JPY',
    status: 'failed',
    createdAt: '2025-08-30T12:15:00Z',
    paymentIntent: {
      eventId: '2',
      rsvpId: 'rsvp2'
    }
  },
  {
    id: 'pay3',
    paymentIntentId: 'pi3',
    pspPaymentId: 'komoju_pay_345678',
    amount: 2000,
    currency: 'JPY',
    status: 'refunded',
    createdAt: '2025-08-29T14:20:00Z',
    paymentIntent: {
      eventId: '1',
      rsvpId: 'rsvp3'
    }
  }
];

export async function GET() {
  // API遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json({ payments: dummyPayments });
}
