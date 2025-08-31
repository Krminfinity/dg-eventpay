import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as paymentsRouter } from './routes/payments';
import { router as webhooksRouter } from './routes/webhooks';
import { router as testRouter } from './routes/test';

dotenv.config();

const app = express();
app.use(cors());

// /webhooks/psp は署名検証のため raw を要求
app.post('/webhooks/psp', express.raw({ type: '*/*' }));

// その他は JSON
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));
app.use(paymentsRouter);
app.use(webhooksRouter);
app.use(testRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`DG EventPay API listening on :${port}`);
});
