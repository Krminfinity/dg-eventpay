import { prisma } from '../lib/database';
import { getPSP } from '../adapters/psp';
import type { CheckoutMethod } from '../adapters/psp';

export interface CreatePaymentIntentArgs {
  eventId: string;
  rsvpId: string;
  method: CheckoutMethod;
  amount?: number;
}

export interface CreatePaymentIntentResult {
  intentId: string;
  hostedUrl: string;
  dbIntentId: string;
}

export class PaymentService {
  static async createPaymentIntent(args: CreatePaymentIntentArgs): Promise<CreatePaymentIntentResult> {
    // 1. イベント・RSVPの存在確認
    const event = await prisma.event.findUnique({
      where: { id: args.eventId },
    });
    
    if (!event) {
      throw new Error(`Event not found: ${args.eventId}`);
    }

    const rsvp = await prisma.eventRsvp.findUnique({
      where: { id: args.rsvpId },
    });

    if (!rsvp) {
      throw new Error(`RSVP not found: ${args.rsvpId}`);
    }

    if (rsvp.eventId !== args.eventId) {
      throw new Error('RSVP does not belong to the specified event');
    }

    // 2. 金額を決定（引数指定 or イベント料金）
    const amount = args.amount || event.fee;

    if (amount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }

    // 3. PSPでセッション作成
    const psp = getPSP();
    const session = await psp.createCheckoutSession({
      eventId: args.eventId,
      rsvpId: args.rsvpId,
      amount,
      currency: 'JPY',
      method: args.method
    });

    // 4. DBに PaymentIntent を保存
    const paymentIntent = await prisma.paymentIntent.create({
      data: {
        eventId: args.eventId,
        rsvpId: args.rsvpId,
        pspIntentId: session.intentId,
        amount,
        currency: 'JPY',
        method: args.method,
        hostedUrl: session.url,
        status: 'created'
      }
    });

    return {
      intentId: session.intentId,
      hostedUrl: session.url,
      dbIntentId: paymentIntent.id
    };
  }

  static async handleWebhookEvent(eventId: string, eventType: string, data: any) {
    // 重複イベント処理を防ぐ
    const existing = await prisma.webhookEvent.findUnique({
      where: { pspEventId: eventId }
    });

    if (existing) {
      console.log(`📧 Webhook event ${eventId} already processed, skipping`);
      return;
    }

    // Webhookイベントを記録
    const webhookEvent = await prisma.webhookEvent.create({
      data: {
        pspEventId: eventId,
        eventType,
        rawData: JSON.stringify(data),
        processed: false
      }
    });

    console.log(`📧 Webhook event ${eventId} (${eventType}) recorded`);

    // イベントタイプ別の処理
    try {
      await PaymentService.processWebhookEvent(eventType, data);
      
      // 処理完了をマーク
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: {
          processed: true,
          processedAt: new Date()
        }
      });
      
      console.log(`✅ Webhook event ${eventId} processed successfully`);
    } catch (error: any) {
      console.error(`❌ Failed to process webhook event ${eventId}:`, error.message);
      // 処理失敗もログに記録（リトライ可能にするため）
    }
  }

  private static async processWebhookEvent(eventType: string, data: any) {
    switch (eventType) {
      case 'payment.succeeded':
        await PaymentService.handlePaymentSucceeded(data);
        break;
      case 'refund.succeeded':
        await PaymentService.handleRefundSucceeded(data);
        break;
      case 'payment.failed':
        await PaymentService.handlePaymentFailed(data);
        break;
      default:
        console.log(`🔄 Unhandled webhook event type: ${eventType}`);
    }
  }

  private static async handlePaymentSucceeded(data: any) {
    const pspPaymentId = data.id;
    if (!pspPaymentId) return;

    // PaymentIntentから関連情報を取得
    // 実装時はdata内のmetadataやexternal_order_numで紐付け
    console.log(`💰 Payment succeeded: ${pspPaymentId}`);
    
    // TODO: Payment レコード作成、PaymentIntent ステータス更新
    // TODO: EventRsvp ステータス更新（confirmed）
  }

  private static async handleRefundSucceeded(data: any) {
    const pspRefundId = data.id;
    if (!pspRefundId) return;

    console.log(`💸 Refund succeeded: ${pspRefundId}`);
    
    // TODO: Refund レコード更新、Payment ステータス更新
  }

  private static async handlePaymentFailed(data: any) {
    const pspPaymentId = data.id;
    if (!pspPaymentId) return;

    console.log(`❌ Payment failed: ${pspPaymentId}`);
    
    // TODO: PaymentIntent ステータス更新（failed）
  }
}
