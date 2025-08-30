# 運用監視・KPIしきい値（MVP）

更新日: 2025-08-30
状態: v1

## KPI/しきい値
- API レイテンシ p95 ≤ 300ms（5分移動平均）
  - Warning: >300ms 連続3区間、Critical: >600ms 連続3区間
- Webhook遅延（受信→処理完了）p95 ≤ 2s
  - Warning: >2s 連続3区間、Critical: >5s 連続3区間
- 決済成功率（当日）≥ 98%
  - Warning: <98%、Critical: <95%
- DLQ深さ ≤ 10 件
  - Warning: >10、Critical: >50
- リマインド送信失敗率 ≤ 1%
  - Warning: >1%、Critical: >5%

## アラート運用
- 営業時間: 10:00-19:00 JP（MVP）
- 重大度: Critical=即対応、Warning=翌営業日内に対応

## ダッシュボード（MVP）
- APIレイテンシ/エラーレート、Webhook処理時間、決済成功率、DLQ件数
