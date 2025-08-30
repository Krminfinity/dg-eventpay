# 詳細設計 - エラー設計/レスポンス規約

更新日: 2025-08-30
状態: ドラフト v0

## レスポンス基本形
```json
{ "code": "invalid_request", "message": "fee_amount must be >= 0", "details": { "field": "fee_amount" }, "trace_id": "..." }
```

## エラーコード一覧（抜粋）
- invalid_request: バリデーション失敗/仕様違反
- unauthorized: 認証失敗/権限なし
- not_found: 対象が存在しない
- conflict: 競合（状態/一意制約/二重実行）
- rate_limited: レート制限
- provider_error: 外部API失敗（VT4G等）
- webhook_invalid: 署名/時刻不正
- webhook_replay: リプレイ検出
- internal: 予期せぬエラー

## HTTPマッピング
- 400 invalid_request
- 401 unauthorized
- 403 unauthorized（権限なし）
- 404 not_found
- 409 conflict
- 422 invalid_request（意味上）
- 429 rate_limited
- 5xx internal/provider_error

## ログ/監査
- エラーは必ずtrace_id付与
- PIIはマスク
- 返金/振込/権限変更はaudit_logに記録
