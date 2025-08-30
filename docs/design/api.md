# DG EventPay 基本設計 - API（概略）

更新日: 2025-08-30
状態: ドラフト v1（PSP: MVPはKOMOJU、将来VeriTrans4Gへ移行可能）

共通:
- MediaType: application/json
- 認証: OrganizerはBearer(OIDC) / ParticipantはMagic Link Token（イベント限定）
- 冪等性: 書き込みに `Idempotency-Key` ヘッダ

## イベント
- POST /events
  - req: { title, description, fee_amount, deadline_at, cancel_policy, visibility, confirmation_deadline_at?, min_participants?, min_total_amount? }
  - res: { id, share_url }
- GET /events/:id
- PATCH /events/:id
  - 変更可能: title, description, fee_amount, visibility, deadline_at, cancel_policy,
              confirmation_deadline_at, min_participants, min_total_amount

## 日程調整
- POST /events/:id/date-options { options: [{ starts_at, ends_at, note }] }
- POST /events/:id/confirm-date { option_id }

## 参加/招待
- POST /events/:id/invite { emails[] }
- POST /events/:id/rsvp { name, email, status }
- GET  /events/:id/summary

## 決済
- POST /events/:id/payment-intents { rsvp_id, method }
  - res: { intent_id, hosted_url | qr_payload | convenience_slip }
- GET /payments/:id
- POST /payments/:id/refund { amount, reason }

## Webhook
- POST /webhooks/psp
  - 署名検証、重複排除、非同期処理。res: 200 OK（即時）

## 振込
- GET /payouts
- GET /payouts/:id

## エラー
- 例: { code, message, details, trace_id }
- 主なコード: invalid_request, unauthorized, not_found, conflict, rate_limited, internal
