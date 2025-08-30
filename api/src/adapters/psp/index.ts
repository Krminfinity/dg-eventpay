export type CheckoutMethod = 'card' | 'paypay' | 'convenience';

export interface CreateCheckoutSessionArgs {
  eventId: string;
  rsvpId: string;
  amount: number;
  currency: 'JPY';
  method: CheckoutMethod;
}

export interface CreateCheckoutSessionResult {
  intentId: string;
  url: string;
}

export interface RefundArgs {
  paymentId: string;
  amount: number;
  reason?: string;
}

export interface RefundResult {
  refundId: string;
}

export interface WebhookVerifyArgs {
  signature: string;
  payload: Buffer;
}

export interface PSPEvent {
  id: string;
  type: string; // normalized type, e.g., payment.succeeded
  data: unknown;
}

export interface PSPAdapter {
  createCheckoutSession(args: CreateCheckoutSessionArgs): Promise<CreateCheckoutSessionResult>;
  refundPayment(args: RefundArgs): Promise<RefundResult>;
  verifyWebhook(args: WebhookVerifyArgs): Promise<PSPEvent>;
}

import { komojuAdapter } from './komoju';

export function getPSP(): PSPAdapter {
  return komojuAdapter();
}
