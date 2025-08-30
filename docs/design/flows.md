# DG EventPay 基本設計 - シーケンス/フロー

更新日: 2025-08-30
状態: ドラフト v0

## 1) イベント作成～共有
```mermaid
sequenceDiagram
  participant Org as Organizer
  participant FE as Frontend
  participant API as API
  participant DB as DB
  Org->>FE: 入力（タイトル/会費/候補日）
  FE->>API: POST /events
  API->>DB: Event/DateOption作成
  DB-->>API: OK
  API-->>FE: share_url返却
  FE-->>Org: 共有リンク表示
```

## 2) 参加/決済（事前）
```mermaid
sequenceDiagram
  participant Par as Participant
  participant FE as Frontend(e)
  participant API as API
  participant VT as VeriTrans4G
  participant WK as Worker
  participant DB as DB
  Par->>FE: イベントページアクセス
  FE->>API: POST /events/:id/rsvp
  API->>DB: RSVP作成
  FE->>API: POST /events/:id/payment-intents
  API->>VT: Hosted/Token で意図作成
  VT-->>Par: 決済画面
  VT-->>API: Webhook(authorized/captured)
  API->>WK: キュー投入
  WK->>DB: PaymentIntent/Payment更新
  WK-->>Par: メール通知（領収）
```

## 3) 返金
```mermaid
sequenceDiagram
  participant Org as Organizer
  participant API as API
  participant VT as VeriTrans4G
  participant WK as Worker
  participant DB as DB
  Org->>API: POST /payments/:id/refund {amount}
  API->>VT: Refund API
  VT-->>API: 受理
  API->>WK: キュー投入
  WK->>DB: Refundレコード更新
  WK-->>Org: 通知/ダッシュボード反映
```

## 4) 振込（バッチ）
```mermaid
sequenceDiagram
  participant Cron as Scheduler
  participant WK as Worker
  participant DB as DB
  Cron->>WK: バッチ起動
  WK->>DB: 未振込のイベント集計
  WK->>DB: payout/payout_batch作成
  WK-->>Org: 明細通知
```
