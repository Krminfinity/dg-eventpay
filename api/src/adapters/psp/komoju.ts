import crypto from 'crypto';
import type { PSPAdapter, CreateCheckoutSessionArgs, CreateCheckoutSessionResult, RefundArgs, RefundResult, WebhookVerifyArgs, PSPEvent } from './index';

export function komojuAdapter(): PSPAdapter {
  const secret = process.env.KOMOJU_SECRET_KEY || '';
  const webhookSecret = process.env.KOMOJU_WEBHOOK_SECRET || '';
  const skipVerify = (process.env.KOMOJU_WEBHOOK_SKIP_VERIFY || '').toLowerCase() === 'true';

  return {
    async createCheckoutSession(args: CreateCheckoutSessionArgs): Promise<CreateCheckoutSessionResult> {
      // NOTE: KOMOJU Hostedの実API呼び出しは未実装（MVP雛形）。
      // 実装時はsecretを用いHTTPSでセッション作成し、返却URLを受け取る。
      const fakeId = `pi_${Date.now()}`;
      const fakeUrl = `https://checkout.komoju.com/sessions/${fakeId}`;
      return { intentId: fakeId, url: fakeUrl };
    },

    async refundPayment(args: RefundArgs): Promise<RefundResult> {
      // NOTE: 実装時にKOMOJUのRefund APIを呼び出す。
      const fakeId = `re_${Date.now()}`;
      return { refundId: fakeId };
    },

    async verifyWebhook({ signature, payload }: WebhookVerifyArgs): Promise<PSPEvent> {
      // 初回接続確認などで検証をスキップ可能にするフラグ
      if (skipVerify) {
        const json = JSON.parse(payload.toString('utf-8'));
        return {
          id: json.id || `evt_${Date.now()}`,
          type: normalizeType(json.type || ''),
          data: json,
        };
      }

      // NOTE: 実装時にKOMOJUの正式仕様へ置換予定。暫定でHMAC検証。
      if (!webhookSecret) throw new Error('KOMOJU_WEBHOOK_SECRET not set');
      if (!signature) throw new Error('missing signature');
      const hmac = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');
      if (!signature.includes(hmac)) throw new Error('invalid signature');
      const json = JSON.parse(payload.toString('utf-8'));
      const normalized: PSPEvent = {
        id: json.id || `evt_${Date.now()}`,
        type: normalizeType(json.type || ''),
        data: json,
      };
      return normalized;
    }
  };
}

function normalizeType(providerType: string): string {
  // Provider固有の型を内部の共通型へマッピング
  switch (providerType) {
    // 決済（成功系）：captured を共通の payment.succeeded に正規化
    case 'payment.captured':
    case 'payment.succeeded':
      return 'payment.succeeded';
    // 決済（その他）
    case 'payment.authorized':
    case 'payment.updated':
    case 'payment.expired':
    case 'payment.cancelled':
    case 'payment.failed':
    case 'payment.marked.as.fraud':
      return providerType;
    // 返金系
    case 'payment.refund.created':
      return 'refund.created';
    case 'payment.refunded':
    case 'refund.succeeded':
      return 'refund.succeeded';
    case 'refund.failed':
      return 'refund.failed';
    // その他（顧客/出金/定期/支出/ピン）
    case 'ping':
    case 'customer.created':
    case 'customer.updated':
    case 'customer.deleted':
    case 'payout.created':
    case 'settlement.created':
    case 'subscription.created':
    case 'subscription.captured':
    case 'subscription.failed':
    case 'subscription.suspended':
    case 'subscription.deleted':
    case 'disbursement.created':
    case 'disbursement.cancelled':
    case 'disbursement.failed':
    case 'disbursement.paid':
    case 'refund_request.updated':
      return providerType;
    default:
      return providerType || 'unknown';
  }
}
