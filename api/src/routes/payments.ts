import { Router } from 'express';
import { getPSP } from '../adapters/psp';
import { withIdempotency } from '../lib/idempotency';

export const router = Router();

// POST /events/:eventId/payment-intents
router.post('/events/:eventId/payment-intents', withIdempotency, async (req, res) => {
  const { eventId } = req.params;
  const { rsvp_id, method } = req.body || {};
  if (!rsvp_id || !method) return res.status(400).json({ code: 'invalid_request', message: 'rsvp_id and method are required' });

  // TODO: validate event/rsvp existence & status
  const psp = getPSP();
  try {
    const session = await psp.createCheckoutSession({
      eventId,
      rsvpId: rsvp_id,
      amount: 0, // TODO: lookup event fee
      currency: 'JPY',
      method
    });
    return res.status(201).json({ intent_id: session.intentId, hosted_url: session.url });
  } catch (e: any) {
    return res.status(500).json({ code: 'provider_error', message: e?.message || 'psp error' });
  }
});

// POST /payments/:paymentId/refund
router.post('/payments/:paymentId/refund', withIdempotency, async (req, res) => {
  const { paymentId } = req.params;
  const { amount, reason } = req.body || {};
  if (!amount || amount <= 0) return res.status(400).json({ code: 'invalid_request', message: 'amount must be > 0' });
  const psp = getPSP();
  try {
    const result = await psp.refundPayment({ paymentId, amount, reason });
    return res.status(202).json({ id: result.refundId, status: 'requested' });
  } catch (e: any) {
    return res.status(500).json({ code: 'provider_error', message: e?.message || 'psp error' });
  }
});
