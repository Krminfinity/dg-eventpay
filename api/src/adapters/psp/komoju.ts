import crypto from 'crypto';
import type { PSPAdapter, CreateCheckoutSessionArgs, CreateCheckoutSessionResult, RefundArgs, RefundResult, WebhookVerifyArgs, PSPEvent } from './index';

export function komojuAdapter(): PSPAdapter {
  const secret = process.env.KOMOJU_SECRET_KEY || '';
  const webhookSecret = process.env.KOMOJU_WEBHOOK_SECRET || '';
  const skipVerify = (process.env.KOMOJU_WEBHOOK_SKIP_VERIFY || '').toLowerCase() === 'true';
  const apiVersion = process.env.KOMOJU_API_VERSION || '2025-01-28';

  return {
    async createCheckoutSession(args: CreateCheckoutSessionArgs): Promise<CreateCheckoutSessionResult> {
      if (!secret) throw new Error('KOMOJU_SECRET_KEY is required');
      
      const sessionData = {
        amount: args.amount,
        currency: args.currency,
        external_order_num: `${args.eventId}-${args.rsvpId}`,
        payment_types: [mapPaymentMethod(args.method)],
        metadata: {
          event_id: args.eventId,
          rsvp_id: args.rsvpId
        }
      };

      const response = await fetch('https://komoju.com/api/v1/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(secret + ':').toString('base64')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(apiVersion && { 'Komoju-Version': apiVersion })
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`KOMOJU API error: ${response.status} ${error}`);
      }

      const session = await response.json();
      return { 
        intentId: session.id, 
        url: session.session_url 
      };
    },

    async refundPayment(args: RefundArgs): Promise<RefundResult> {
      if (!secret) throw new Error('KOMOJU_SECRET_KEY is required');

      const refundData = {
        amount: args.amount,
        description: args.reason || 'Refund request'
      };

      const response = await fetch(`https://komoju.com/api/v1/payments/${args.paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(secret + ':').toString('base64')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(apiVersion && { 'Komoju-Version': apiVersion })
        },
        body: JSON.stringify(refundData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`KOMOJU refund error: ${response.status} ${error}`);
      }

      const refund = await response.json();
      return { refundId: refund.id };
    },

    async verifyWebhook({ signature, payload }: WebhookVerifyArgs): Promise<PSPEvent> {
      // 初回接続確認などで検証をスキップ可能にするフラグ
      if (skipVerify) {
        console.log('⚠️  Webhook signature verification SKIPPED');
        const json = JSON.parse(payload.toString('utf-8'));
        return {
          id: json.id || `evt_${Date.now()}`,
          type: normalizeType(json.type || ''),
          data: json,
        };
      }

      // KOMOJU公式署名検証（HMAC-SHA256）
      if (!webhookSecret) throw new Error('KOMOJU_WEBHOOK_SECRET not set');
      if (!signature) throw new Error('missing signature');
      
      // KOMOJUのSignatureヘッダーは "sha256=hash" または "hash" 形式
      const normalizedSignature = signature.startsWith('sha256=') ? signature : `sha256=${signature}`;
      const expectedSignature = `sha256=${crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex')}`;

      console.log('🔐 Webhook signature verification:');
      console.log('  Received:', normalizedSignature);
      console.log('  Expected:', expectedSignature);
      console.log('  Match:', normalizedSignature === expectedSignature);

      if (normalizedSignature !== expectedSignature) {
        throw new Error('invalid signature');
      }

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

// 決済方法をKOMOJUのpayment_typesにマッピング
function mapPaymentMethod(method: string): string {
  switch (method) {
    case 'card': return 'credit_card';
    case 'paypay': return 'paypay';
    case 'convenience': return 'konbini';
    default: return 'credit_card';
  }
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
