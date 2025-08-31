import { NextRequest, NextResponse } from 'next/server';

// ダミーイベントデータ（RSVP含む）
const dummyEventDetails: Record<string, {
  id: string;
  name: string;
  description: string;
  fee: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  rsvps: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
  }>;
}> = {
  '1': {
    id: '1',
    name: 'DG技術勉強会 #1',
    description: 'React/Next.jsの最新技術について学ぶ勉強会です',
    fee: 2000,
    currency: 'JPY',
    status: 'active',
    createdAt: '2025-08-30T10:00:00Z',
    updatedAt: '2025-08-30T10:00:00Z',
    rsvps: [
      {
        id: 'rsvp1',
        name: '山田太郎',
        email: 'yamada@example.com',
        status: 'confirmed',
        createdAt: '2025-08-30T11:00:00Z'
      },
      {
        id: 'rsvp2',
        name: '佐藤花子',
        email: 'sato@example.com',
        status: 'pending',
        createdAt: '2025-08-30T12:00:00Z'
      }
    ]
  },
  '2': {
    id: '2',
    name: 'DGネットワーキング懇親会',
    description: '技術者同士の交流を深める懇親会です',
    fee: 3500,
    currency: 'JPY',
    status: 'active',
    createdAt: '2025-08-29T15:30:00Z',
    updatedAt: '2025-08-29T15:30:00Z',
    rsvps: [
      {
        id: 'rsvp3',
        name: '田中次郎',
        email: 'tanaka@example.com',
        status: 'cancelled',
        createdAt: '2025-08-30T13:00:00Z'
      }
    ]
  },
  '3': {
    id: '3',
    name: 'DG年末パーティー（中止）',
    description: '年末の大イベント（諸事情により中止）',
    fee: 5000,
    currency: 'JPY',
    status: 'cancelled',
    createdAt: '2025-08-25T09:00:00Z',
    updatedAt: '2025-08-28T12:00:00Z',
    rsvps: []
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // API遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { id: eventId } = await params;
  const event = dummyEventDetails[eventId];
  
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  
  return NextResponse.json({ event });
}
