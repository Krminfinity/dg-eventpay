import { Request, Response, NextFunction } from 'express';
import { prisma } from './database';

export function withIdempotency(req: Request, res: Response, next: NextFunction) {
  const key = req.header('Idempotency-Key');
  if (key) {
    res.setHeader('Idempotency-Key', key);
    // リクエストに幂等性キーを保存（後でミドルウェアで使用）
    (req as any).idempotencyKey = key;
  }
  next();
}

export async function checkIdempotency(key: string, endpoint: string): Promise<any> {
  const existing = await prisma.idempotencyKey.findUnique({
    where: { key }
  });

  if (existing) {
    if (existing.status === 'completed' && existing.responseData) {
      // 既に完了した処理の結果を返す
      return { isReplay: true, response: JSON.parse(existing.responseData) };
    } else if (existing.status === 'processing') {
      // 処理中の場合は409 Conflictで応答
      throw new Error('Request already processing');
    }
  }

  // 新しい幂等性キーを記録（処理中としてマーク）
  await prisma.idempotencyKey.upsert({
    where: { key },
    create: {
      key,
      endpoint,
      status: 'processing'
    },
    update: {
      status: 'processing',
      updatedAt: new Date()
    }
  });

  return { isReplay: false };
}

export async function completeIdempotency(key: string, responseData: any) {
  await prisma.idempotencyKey.update({
    where: { key },
    data: {
      status: 'completed',
      responseData: JSON.stringify(responseData)
    }
  });
}

export async function failIdempotency(key: string) {
  await prisma.idempotencyKey.update({
    where: { key },
    data: {
      status: 'failed'
    }
  });
}
