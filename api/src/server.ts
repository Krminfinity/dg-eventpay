import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as paymentsRouter } from './routes/payments';
import { router as webhooksRouter } from './routes/webhooks';
import { router as testRouter } from './routes/test';
import eventsRouter from './routes/events';
import refundsRouter from './routes/refunds';
import { router as authRouter } from './routes/auth';
import { corsMiddleware } from './middleware/cors';

dotenv.config();

const app = express();

// CORS設定をフロントエンド用に適用
app.use(corsMiddleware);

// /webhooks/psp は署名検証のため raw を要求
app.post('/webhooks/psp', express.raw({ type: '*/*' }));

// その他は JSON
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/payments', paymentsRouter);
app.use('/webhooks', webhooksRouter);
app.use('/test', testRouter);
app.use('/events', eventsRouter);
app.use('/refunds', refundsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`DG EventPay API listening on :${port}`);
});
