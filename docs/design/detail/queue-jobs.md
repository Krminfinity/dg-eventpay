# 詳細設計 - 非同期ジョブ/再試行ポリシー

更新日: 2025-08-30
状態: ドラフト v0

## ジョブ種別
- webhook.process { webhook_event_id }
- payment.update_state { intent_id|payment_id, provider_payload }
- refund.sync { refund_id }
- notify.send { channel, template_id, to, variables }
- rsvp.remind_unpaid { event_id }
- payout.generate_batch { scheduled_for }
- payout.execute { payout_batch_id }

## 共通ポリシー
- 冪等キー: job_type + primary_id
- 再試行: 最大3回、指数バックオフ（1m, 5m, 30m）
- タイムアウト: 30s（外部APIはそれ以下）
- DLQ: あり（手動リプレイUI想定）
- 並列数: キューごとに上限（例: webhook 10, notify 20, payout 2）

## 可観測性
- メトリクス: ジョブ成功率、リトライ回数、処理遅延
- ログ: trace_id, job_id, idempotency_key
