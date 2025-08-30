# 詳細設計 - 入力検証/業務ルール

更新日: 2025-08-30
状態: ドラフト v0

## 共通
- すべての書き込みAPIは `Idempotency-Key` を推奨（重複送信防止）。
- 金額は整数（JPY）で受け付け、小数禁止。
- 日時はISO 8601（UTC、またはTZ明示）。

## イベント
- title: 1..120文字、絵文字可（正規化NFC）
- description: 最大4000文字
- fee_amount: 0以上
- capacity: 1..10000（任意）
- deadline_at: 現在以降、confirmed_atより前
- confirmation_deadline_at: 現在以降、deadline_atと同一またはそれ以前（成立判定用）。未設定時はdeadline_atを流用
- min_participants: null または 1..10000
- min_total_amount: null または 0以上（fee_amount×想定人数を超えない現実的値）
- visibility: public|link_only|private
- cancel_policy: 最大1000文字

## 日程候補
- starts_at < ends_at、イベント期間は30日以内
- 投票締切後は追加不可

## 参加/RSVP
- name: 1..120文字
- email: RFC5322（ドメイン存在チェックは非同期）
- 参加重複: (event_id, email) 一意

## 決済
- method: card|qr|convenience（イベント設定で許可されているもののみ）
- intent作成はRSVP=goingのみ
- intentは既存activeがある場合は再利用（新規作成禁止）

## 返金
- 金額は1..captured合計-既返金合計
- 期間制限（例: イベント開始前のみ全額、それ以降は部分/不可）→ ポリシー設定に準拠
- 理由は最大200文字

## 振込
- 口座: 銀行/支店コード、名義（全角カナ推奨）
- ネガティブ残高は次回繰越

## 通知
- バッチ送信はレート制限（例: 50 req/s）
