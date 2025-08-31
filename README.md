# DG EventPay

Node.js + TypeScript の小規模API（Express）。決済はKOMOJUを想定。開発時はHookdeckの固定URLを使い、Destinationだけを現在のローカル・トンネルに差し替える運用を標準とします。

## 構成
- `api/` バックエンドAPI（Express）
- `.vscode/tasks.json` VS Codeタスク（API起動・トンネル起動）
- `docs/` 設計/メモ（任意）

## 必要要件
- Node.js 18+ / npm
- Windows PowerShell（既定）

## クイックスタート（Hookdeck固定運用）
1) 依存のインストール
```powershell
cd api
npm install
```
2) `.env` 作成（例をコピーして実値をセット）
```powershell
Copy-Item .env.example .env -Force
# .env を開き、KOMOJU_* を自分の値に置き換え
# 初回は KOMOJU_WEBHOOK_SKIP_VERIFY=true で疎通確認可
```
3) VS Codeタスクで起動
- Terminal → Run Task… → `Start API (PORT from .env)`
- Terminal → Run Task… → `Start Tunnel (use .env PORT)`
  - トンネル出力に表示される `Webhook URL: https://<sub>.loca.lt/webhooks/psp` を控える
4) Hookdeck の Destination を上記Webhook URLに更新
- KOMOJUのWebhook設定は固定のHookdeck Source URLのまま
- HookdeckのRoute/Destinationのみ差し替え
5) KOMOJUダッシュボードの「テスト送信」→ サーバーログに `psp.event <type> <id>` が出ればOK
6) 確認後は `.env` の `KOMOJU_WEBHOOK_SKIP_VERIFY=false` に戻して再起動

## API スクリプト（api/）
- `npm run dev` 開発起動（ポートは `.env` の `PORT`、推奨 4000）
- `npm run build` TypeScriptビルド
- `npm start` ビルド成果物の起動
- `npm run tunnel` localtunnel で公開URLを発行（`.env` の `PORT` を使用）

## ヘルスチェック
- `GET http://localhost:PORT/health`（例: 4000）

## セキュリティ注意
- 実際の鍵やシークレットは `.env` のみ。コミット禁止。
- `api/.env.example` はプレースホルダのみを記載。
- GitHub Push Protection に弾かれた場合は履歴から疑似キーを除去してください（filter-repo推奨）。

## トラブルシュート
- Push Protection により `push declined` の場合
  - 履歴に `sk_test_` / `pk_test_` / `whsec_` 等が残っていないか確認・除去
  - 管理者が必要に応じて一時的にブランチ保護設定を調整
- トンネルで 502/403 の場合
  - トンネルを再起動、または Cloudflare Tunnel 等に切替
  - Hookdeck の Destination を最新URLに更新