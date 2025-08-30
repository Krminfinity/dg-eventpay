import { Request, Response, NextFunction } from 'express';

export function withIdempotency(req: Request, res: Response, next: NextFunction) {
  const key = req.header('Idempotency-Key');
  if (key) res.setHeader('Idempotency-Key', key);
  // NOTE: 実運用ではDB等で重複実行を抑止
  next();
}
