import { NextRequest, NextResponse } from 'next/server';

// ダミーイベントデータ
const dummyEvents = [
  {
    id: '1',
    name: 'DG技術勉強会 #1',
    description: 'React/Next.jsの最新技術について学ぶ勉強会です',
    fee: 2000,
    currency: 'JPY',
    status: 'active',
    createdAt: '2025-08-30T10:00:00Z',
    updatedAt: '2025-08-30T10:00:00Z'
  },
  {
    id: '2',
    name: 'DGネットワーキング懇親会',
    description: '技術者同士の交流を深める懇親会です',
    fee: 3500,
    currency: 'JPY',
    status: 'active',
    createdAt: '2025-08-29T15:30:00Z',
    updatedAt: '2025-08-29T15:30:00Z'
  },
  {
    id: '3',
    name: 'DG年末パーティー（中止）',
    description: '年末の大イベント（諸事情により中止）',
    fee: 5000,
    currency: 'JPY',
    status: 'cancelled',
    createdAt: '2025-08-25T09:00:00Z',
    updatedAt: '2025-08-28T12:00:00Z'
  }
];

export async function GET() {
  // API遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json({ events: dummyEvents });
}
