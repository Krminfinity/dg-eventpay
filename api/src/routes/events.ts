import { Router } from 'express';
import { prisma } from '../lib/database';
import { PaymentService } from '../services/PaymentService';

const router = Router();
// POST /events/:eventId/payment-intents - 決済Intent作成（KOMOJU Hosted連携）
router.post('/:eventId/payment-intents', async (req, res) => {
  const { rsvpId, method, amount } = req.body;
  if (!rsvpId || !method) {
    return res.status(400).json({ error: 'rsvpIdとmethodは必須です' });
  }
  try {
    const result = await PaymentService.createPaymentIntent({
      eventId: req.params.eventId,
      rsvpId,
      method,
      amount,
    });
    res.status(201).json({ hostedUrl: result.hostedUrl, intentId: result.intentId, dbIntentId: result.dbIntentId });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create payment intent' });
  }
});


// GET /events - イベント一覧取得
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /events/:id - イベント詳細取得
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        rsvps: true,
        paymentIntents: true,
      },
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ event });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event detail' });
  }
});

export default router;


// POST /events/:eventId/rsvps - RSVP新規申込
router.post('/:eventId/rsvps', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'nameとemailは必須です' });
  }
  try {
    // イベント存在チェック
    const event = await prisma.event.findUnique({ where: { id: req.params.eventId } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // RSVP作成
    const rsvp = await prisma.eventRsvp.create({
      data: {
        eventId: req.params.eventId,
        name,
        email,
      },
    });
    res.status(201).json({ rsvp });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create RSVP' });
  }
});

// GET /events/:eventId/rsvps - RSVP一覧取得
router.get('/:eventId/rsvps', async (req, res) => {
  try {
    // イベント存在チェック
    const event = await prisma.event.findUnique({ where: { id: req.params.eventId } });
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // RSVP一覧取得
    const rsvps = await prisma.eventRsvp.findMany({
      where: { eventId: req.params.eventId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ rsvps });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch RSVPs' });
  }
});
