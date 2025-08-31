import { Router } from 'express';
import { getPSP } from '../adapters/psp';
import { withIdempotency, checkIdempotency, completeIdempotency, failIdempotency } from '../lib/idempotency';
import { PaymentService } from '../services/PaymentService';

export const router = Router();

// POST /events/:eventId/payment-intents
router.post('/events/:eventId/payment-intents', withIdempotency, async (req, res) => {
  const { eventId } = req.params;
  const { rsvp_id, method, amount } = req.body || {};
  const idempotencyKey = (req as any).idempotencyKey;
  
  if (!rsvp_id || !method) {
    return res.status(400).json({ code: 'invalid_request', message: 'rsvp_id and method are required' });
  }

  try {
    // 幂等性チェック
    if (idempotencyKey) {
      const idempotencyResult = await checkIdempotency(idempotencyKey, 'payment-intents');
      if (idempotencyResult.isReplay) {
        return res.status(201).json(idempotencyResult.response);
      }
    }

    const result = await PaymentService.createPaymentIntent({
      eventId,
      rsvpId: rsvp_id,
      method,
      amount
    });

    const response = {
      intent_id: result.intentId,
      hosted_url: result.hostedUrl,
      db_intent_id: result.dbIntentId
    };

    // 幂等性キーがある場合は成功を記録
    if (idempotencyKey) {
      await completeIdempotency(idempotencyKey, response);
    }

    return res.status(201).json(response);
  } catch (e: any) {
    console.error('Payment session creation failed:', e.message);

    // 幂等性キーがある場合は失敗を記録
    if (idempotencyKey) {
      await failIdempotency(idempotencyKey);
    }

    if (e.message.includes('not found')) {
      return res.status(404).json({ code: 'not_found', message: e.message });
    }

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
    console.error('Refund creation failed:', e.message);
    return res.status(500).json({ code: 'provider_error', message: e?.message || 'psp error' });
  }
});
