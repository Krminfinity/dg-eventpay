# DG EventPay 基本設計 - 非機能設計

更新日: 2025-08-30
状態: ドラフト v0

## SLO/容量計画
- 稼働率99.9%、API p95 ≤ 300ms、Webhook処理p95 ≤ 2s。
- 初期想定: ピーク同時決済 200 RPS、イベント閲覧 1k RPS。

## 可観測性
- ログ: JSON（ts, level, trace_id, user_id, event_id, payment_intent_id）。
- メトリクス: req_count/latency、payment_success_rate、webhook_lag、dlq_depth。
- トレース: OpenTelemetry採用。

## エラー/再試行
- Idempotency-Keyで重複防止。
- 再試行: 3回指数バックオフ、DLQ送り、手動リプレイUI。

## セキュリティ
- CSP厳格、XSS/CSRF対策（SameSite=Lax/Strict、CSRFトークン）。
- レート制限・Bot対策（IP/Tokenベース）。
- 3Dセキュア2.0推奨フラグ。

## データ保全
- RDS多AZ + PITR、バックアップ検証（演習）。
- マイグレーション: 版管理（例: Prisma/Migrate or Liquibase）。

## リリース/運用
- IaC（例: Terraform）。
- ブルーグリーン/キャナリ。
- フィーチャーフラグ（段階公開）。
