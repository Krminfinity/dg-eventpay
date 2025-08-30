# DG EventPay API (MVP Skeleton)

MVP向けの最小APIスケルトン。PSPはKOMOJU Hostedを想定（将来VeriTrans4Gへ移行可能）。

## 機能
- POST /events/:eventId/payment-intents: 決済セッション作成（ダミーURLを返却）
- POST /payments/:paymentId/refund: 返金作成（ダミーIDを返却）
- POST /webhooks/psp: PSP Webhook受信（署名検証はプレースホルダ）
- GET /health: ヘルスチェック

## セットアップ（Windows PowerShell）
```powershell
# 1) 依存インストール
npm install

# 2) 環境変数サンプルをコピー
Copy-Item .env.example .env -Force
# .env を編集して以下を設定（実キーの値を入力。公開・コミット禁止）:
# - KOMOJU_SECRET_KEY       # バックエンド用シークレットキー
# - KOMOJU_PUBLIC_KEY       # フロント用公開キー（必要時）
# - KOMOJU_CLIENT_ID        # 必要な場合のみ
# - KOMOJU_API_VERSION      # 例: 2025-01-28（任意）
# - KOMOJU_WEBHOOK_SECRET   # Webhook署名検証用（ダッシュボードから）
# - PORT                    # 任意（デフォルト 3000）

# 3) 開発起動
npm run dev

# 型定義の警告が出る場合（@types がない）
npm i -D @types/express @types/node

# ビルド+起動
npm run build
npm start
```

## 開発の標準起動フロー（Hookdeck固定運用）
Hookdeckの固定URLをKOMOJUに設定し、HookdeckのDestinationだけを現在のトンネルURLに差し替える運用を標準とします。

1) VS CodeでAPIを起動（PORTは`.env`で4000推奨）
```powershell
npm run dev
```
2) 別ターミナルでトンネルを開始（localtunnel）
```powershell
npm run tunnel
```
	出力される `Webhook URL: https://<subdomain>.loca.lt/webhooks/psp` を控える。

3) HookdeckのDestinationを上記Webhook URLに更新
	- KOMOJUのWebhook設定は固定のHookdeck Source URLのまま
	- HookdeckのRoute/Destinationだけを差し替える

4) KOMOJUダッシュボードから『テスト送信』
	- 初回は `.env` の `KOMOJU_WEBHOOK_SKIP_VERIFY=true` で接続確認
	- ログに `psp.event <type> <id>` が出ればOK

5) 署名検証をオンに戻す
```powershell
# .env を編集
KOMOJU_WEBHOOK_SKIP_VERIFY=false
# サーバー再起動
```

## 実装TODO
- KOMOJUの実API呼び出し（セッション/返金）と署名検証の正確化
- DB連携（event/rsvp/intentの作成・更新、幂等制御）
- ジョブキュー連携（Webhook後処理）
- 入力検証/エラーハンドリング強化
