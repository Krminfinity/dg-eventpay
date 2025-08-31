import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // サンプルイベント作成
  const event1 = await prisma.event.upsert({
    where: { id: 'test-event-001' },
    update: {},
    create: {
      id: 'test-event-001',
      name: '技術勉強会 #1',
      description: 'Node.js と TypeScript の基礎を学ぶ勉強会',
      fee: 1000,
      currency: 'JPY',
      status: 'active',
    },
  });

  const event2 = await prisma.event.upsert({
    where: { id: 'test-event-002' },
    update: {},
    create: {
      id: 'test-event-002',
      name: 'API設計ワークショップ',
      description: 'RESTful APIの設計手法とベストプラクティス',
      fee: 2500,
      currency: 'JPY',
      status: 'active',
    },
  });

  // サンプルRSVP作成
  const rsvp1 = await prisma.eventRsvp.upsert({
    where: { id: 'test-rsvp-001' },
    update: {},
    create: {
      id: 'test-rsvp-001',
      eventId: event1.id,
      name: '田中太郎',
      email: 'tanaka@example.com',
      status: 'pending',
    },
  });

  const rsvp2 = await prisma.eventRsvp.upsert({
    where: { id: 'test-rsvp-002' },
    update: {},
    create: {
      id: 'test-rsvp-002',
      eventId: event2.id,
      name: '佐藤花子',
      email: 'sato@example.com',
      status: 'pending',
    },
  });

  console.log('✅ Seed data created:');
  console.log('  Events:', { event1: event1.id, event2: event2.id });
  console.log('  RSVPs:', { rsvp1: rsvp1.id, rsvp2: rsvp2.id });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
