import express, { Router, Request, Response } from 'express';
import { getPSP } from '../adapters/psp';
import { PaymentService } from '../services/PaymentService';

export const router = Router();

// server.ts 側で /webhooks/psp に raw パーサを適用済み
router.post('/webhooks/psp', async (req: Request, res: Response) => {
  const psp = getPSP();
  const signature =
    req.header('KOMOJU-Signature') ||
    req.header('x-komoju-signature') ||
    req.header('Stripe-Signature') ||
    '';
  const body: any = (req as any).body; // raw 中間ウェアで Buffer
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body ?? {}));
  
  console.log('📥 Webhook received:');
  console.log('  Headers:', JSON.stringify(req.headers, null, 2));
  console.log('  Signature header:', signature);
  console.log('  Payload size:', payload.length, 'bytes');
  console.log('  Payload preview:', payload.toString('utf-8').substring(0, 200) + '...');
  
  try {
    const event = await psp.verifyWebhook({ signature, payload });
    console.log('✅ psp.event', event.type, event.id);
    
    // PaymentServiceでイベント処理
    await PaymentService.handleWebhookEvent(event.id, event.type, event.data);
    
    return res.sendStatus(200);
  } catch (e: any) {
    console.error('❌ webhook verify failed', e?.message);
    return res.status(401).send('invalid signature');
  }
});
