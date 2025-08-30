# 詳細設計 - Webhook連携（PSP: MVPはKOMOJU）

更新日: 2025-08-30
状態: ドラフト v1

## 受信エンドポイント
- POST /webhooks/psp
- 要件
  - 署名検証（PSP提供の署名方式）
  - 時刻ヘッダの検証（±5分）
  - 受信ペイロードのハッシュ保存（重複排除）
  - 200 OKは即時（処理は非同期キュー）

## イベント種別（例）
- payment.succeeded/failed（providerマッピングで統一）
- refund.succeeded/failed
- dispute.opened/closed

## 処理フロー
1. 署名検証/リプレイ防止（timestamp + tolerance）
2. 幂等処理（provider+event_id）
3. DLQ: 連続失敗3回でDLQへ。
4. トランザクション境界: WebhookEvent保存→キュー→WorkerでDB更新/通知

## セキュリティ
- IP制限（可能なら）
- 監査ログ
