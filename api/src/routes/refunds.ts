import { Router } from 'express';
import { prisma } from '../lib/database';
import { withIdempotency, checkIdempotency, completeIdempotency, failIdempotency } from '../lib/idempotency';

const router = Router();

// GET /refunds - 返金履歴一覧
router.get('/', async (req, res) => {
  try {
    const refunds = await prisma.refund.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        payment: true,
      },
    });
    res.json({ refunds });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch refunds' });
  }
});

// POST /refunds - 返金リクエスト（Idempotency-Key対応）
router.post('/', withIdempotency, async (req, res) => {
  const { paymentId, amount, reason } = req.body || {};
  const idempotencyKey = (req as any).idempotencyKey;
  if (!paymentId || !amount) {
    return res.status(400).json({ error: 'paymentIdとamountは必須です' });
  }
  try {
    // 幂等性チェック
    if (idempotencyKey) {
      const idempotencyResult = await checkIdempotency(idempotencyKey, 'refunds');
      if (idempotencyResult.isReplay) {
        return res.status(201).json(idempotencyResult.response);
      }
    }
    // PSP連携（KOMOJU）
    // TODO: PSPアダプタ経由で返金API呼び出し、DB更新
    const response = { refundId: 'dummy', status: 'succeeded' };
    // 幂等性キーがある場合は成功を記録
    if (idempotencyKey) {
      await completeIdempotency(idempotencyKey, response);
    }
    res.status(201).json(response);
  } catch (err: any) {
    if (idempotencyKey) {
      await failIdempotency(idempotencyKey);
    }
    res.status(500).json({ error: err.message || 'Failed to process refund' });
  }
});

export default router;
