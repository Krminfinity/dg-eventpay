# 詳細設計 - 状態遷移（State Machines）

更新日: 2025-08-30
状態: ドラフト v0

## Event
- states: draft → published → scheduled → in_progress → finished → canceled
- transitions
  - draft→published: 主催者が公開
  - published→scheduled: 日程確定
  - scheduled→in_progress: 開始時刻到来
  - in_progress→finished: 終了処理
  - any→canceled: 主催者が中止（制約: 返金処理の完了または進行中）
  - published/scheduled→canceled: confirmation_deadline_at 到来時に成立条件未達（自動）
- invariants
  - canceled後はRSVP新規不可
  - finished後は新規決済不可（返金のみ可）
  - 自動キャンセル時は対象決済に全額返金ジョブをキック（MVPポリシー）

## RSVP
- states: invited → going → declined → waitlist → canceled
- transitions
  - invited→going: 参加表明
  - going→canceled: キャンセル
  - invited/going→declined: 不参加
  - invited→waitlist: 定員超過時
- invariants
  - goingには有効なPaymentIntentが最大1つ（status in [requires_payment, processing, succeeded]）

## PaymentIntent
- states: requires_payment → processing → succeeded → canceled → expired → failed
- triggers
  - create: POST /events/:id/payment-intents
  - processing: VT4Gへ遷移（ホスト画面へ）
  - succeeded: Webhook(captured)処理成功
  - failed: Webhook(failed) or タイムアウト
  - expired: 有効期限到来
  - canceled: 主催者または参加者が取り消し（未確定のみ）
- invariants
  - rsvp_id + status in (requires_payment, processing) は一意

## Payment
- states: authorized → captured → failed → chargeback
- triggers
  - authorized: Webhook(authorized)
  - captured: Webhook(captured) or 後続capture
  - failed: Webhook(failed)
  - chargeback: Webhook(chargeback/opened/closed)
- invariants
  - payment.amount_captured ≤ intent.amount

## Refund
- states: requested → processing → succeeded → failed
- triggers
  - requested: POST /payments/:id/refund
  - processing: VT4G受理
  - succeeded/failed: Webhook(refund)
- invariants
  - Σrefund.amount ≤ payment.amount_captured

## PayoutBatch / Payout
- PayoutBatch states: scheduled → processing → paid → failed
- Payout states: pending → processing → paid → failed
- rules
  - Batch作成時にイベント別にnet額を集計
  - 返金やチャージバック発生時は次回バッチで自動調整（マイナスの場合は繰越）
