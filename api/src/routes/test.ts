import { Router } from 'express';
import { getPSP } from '../adapters/psp';

export const router = Router();

// GET /test/komoju-session - KOMOJU Session作成のテスト
router.get('/test/komoju-session', async (req, res) => {
  const psp = getPSP();
  try {
    const session = await psp.createCheckoutSession({
      eventId: 'test-event-001',
      rsvpId: 'test-rsvp-001',
      amount: 1000,
      currency: 'JPY',
      method: 'card'
    });
    
    return res.json({
      success: true,
      session_id: session.intentId,
      checkout_url: session.url,
      message: 'KOMOJU checkout session created successfully'
    });
  } catch (e: any) {
    console.error('KOMOJU session test failed:', e.message);
    return res.status(500).json({
      success: false,
      error: e.message,
      message: 'Failed to create KOMOJU session'
    });
  }
});

// POST /test/komoju-refund - KOMOJU 返金のテスト
router.post('/test/komoju-refund', async (req, res) => {
  const { payment_id, amount } = req.body || {};
  
  if (!payment_id || !amount) {
    return res.status(400).json({
      success: false,
      message: 'payment_id and amount are required'
    });
  }
  
  const psp = getPSP();
  try {
    const result = await psp.refundPayment({
      paymentId: payment_id,
      amount: Number(amount),
      reason: 'Test refund via API'
    });
    
    return res.json({
      success: true,
      refund_id: result.refundId,
      message: 'KOMOJU refund created successfully'
    });
  } catch (e: any) {
    console.error('KOMOJU refund test failed:', e.message);
    return res.status(500).json({
      success: false,
      error: e.message,
      message: 'Failed to create KOMOJU refund'
    });
  }
});
