"use client";

import React, { useEffect, useState } from 'react';

interface Payment {
  id: string;
  paymentIntentId: string;
  pspPaymentId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paymentIntent: {
    eventId: string;
    rsvpId: string;
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/payments`)
      .then(res => res.json())
      .then(data => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch(err => {
        setError('決済履歴の取得に失敗しました');
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'green';
      case 'failed': return 'red';
      case 'refunded': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <main style={{ padding: 32 }}>
      <h1>決済履歴</h1>
      {loading && <p>読み込み中...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>決済ID</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>金額</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>ステータス</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>作成日</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{payment.pspPaymentId}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{payment.amount} {payment.currency}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>
                <span style={{ color: getStatusColor(payment.status) }}>{payment.status}</span>
              </td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{new Date(payment.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {payments.length === 0 && !loading && <p>決済履歴がありません</p>}
    </main>
  );
}
