# 詳細設計 - 認証/認可

更新日: 2025-08-30
状態: ドラフト v0

## 認証
- Organizer: OIDC（Google/Microsoft）+ Email Magic Link（パスワードレス）
  - トークン: JWT（短命アクセス + 長命リフレッシュ）
  - クレーム: sub(user_id), roles, org_id(optional), iat, exp
- Participant: イベント限定トークン（RSVP作成時にメールリンクで発行）
  - 有効期限: 24h（再発行可）

## 認可（RBAC）
- 役割: admin, organizer, cohost, participant
- リソーススコープ: event:{id} 単位

| アクション | organizer | cohost | participant |
| --- | --- | --- | --- |
| イベント作成/編集 | ○ | △(一部) | × |
| 日程確定 | ○ | ○ | × |
| 参加管理 | ○ | ○ | 自分のみ |
| 決済作成 | ○(代理) | ○(代理) | 自分のみ |
| 返金 | ○ | △(上限あり) | × |
| 振込参照 | ○ | × | × |

## ポリシー例
- 返金はイベント開始前のみ上限100%/開始後は0-50%（設定依存）
- 共同管理は明示招待と受諾が必要

## セッション/CSRF
- SPAはBearer運用、CookieはHttpOnly+SameSite=Strictで必要最小
- CSRFはCookie利用APIにトークン必須
