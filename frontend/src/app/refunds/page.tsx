"use client";

import React, { useEffect, useState } from 'react';

interface Refund {
  id: string;
  paymentId: string;
  pspRefundId: string;
  amount: number;
  currency: string;
  status: string;
  reason?: string;
  createdAt: string;
  payment: {
    pspPaymentId: string;
  };
}

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/refunds`)
      .then(res => res.json())
      .then(data => {
        setRefunds(data.refunds || []);
        setLoading(false);
      })
      .catch(err => {
        setError('返金履歴の取得に失敗しました');
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'green';
      case 'failed': return 'red';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <main style={{ padding: 32 }}>
      <h1>返金履歴</h1>
      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>返金ID</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>元決済ID</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>金額</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>ステータス</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>理由</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>作成日</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map(refund => (
            <tr key={refund.id}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{refund.pspRefundId}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{refund.payment.pspPaymentId}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{refund.amount} {refund.currency}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>
                <span style={{ color: getStatusColor(refund.status) }}>{refund.status}</span>
              </td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{refund.reason || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{new Date(refund.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {refunds.length === 0 && !loading && <p>返金履歴がありません</p>}
    </main>
  );
}
