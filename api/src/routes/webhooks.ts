import express, { Router, Request, Response } from 'express';
import { getPSP } from '../adapters/psp';

export const router = Router();

// server.ts 側で /webhooks/psp に raw パーサを適用済み
router.post('/webhooks/psp', async (req: Request, res: Response) => {
  const psp = getPSP();
  const signature = req.header('KOMOJU-Signature') || req.header('Stripe-Signature') || '';
  const body: any = (req as any).body; // raw 中間ウェアで Buffer
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body ?? {}));
  try {
    const event = await psp.verifyWebhook({ signature, payload });
    // TODO: enqueue job to update Payment/Refund based on event.type
    console.log('psp.event', event.type, event.id);
    return res.sendStatus(200);
  } catch (e: any) {
    console.error('webhook verify failed', e?.message);
    return res.status(401).send('invalid signature');
  }
});
