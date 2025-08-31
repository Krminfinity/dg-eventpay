"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  description?: string;
  fee: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  rsvps: RSVP[];
}

interface RSVP {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

interface RSVPFormData {
  name: string;
  email: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rsvpForm, setRsvpForm] = useState<RSVPFormData>({ name: '', email: '' });
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    fetch(`${API_BASE}/events/${eventId}`)
      .then(res => res.json())
      .then(data => {
        setEvent(data.event || null);
        setLoading(false);
      })
      .catch(err => {
        setError('イベント詳細の取得に失敗しました');
        setLoading(false);
      });
  }, [eventId]);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const res = await fetch(`${API_BASE}/events/${eventId}/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpForm)
      });
      if (res.ok) {
        // RSVP作成成功 - ページを再読み込み
        window.location.reload();
      } else {
        alert('RSVP申込に失敗しました');
      }
    } catch (err) {
      alert('RSVP申込に失敗しました');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handlePayment = async (rsvpId: string) => {
    setPaymentLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const res = await fetch(`${API_BASE}/events/${eventId}/payment-intents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rsvpId, method: 'card' })
      });
      const data = await res.json();
      if (res.ok && data.hostedUrl) {
        // KOMOJU Hosted URLに遷移
        window.open(data.hostedUrl, '_blank');
      } else {
        alert('決済URLの生成に失敗しました');
      }
    } catch (err) {
      alert('決済URLの生成に失敗しました');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <main style={{ padding: 32 }}><p>読み込み中...</p></main>;
  if (error) return <main style={{ padding: 32 }}><p style={{ color: 'red' }}>{error}</p></main>;
  if (!event) return <main style={{ padding: 32 }}><p>イベントが見つかりません</p></main>;

  return (
    <main style={{ padding: 32 }}>
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <p>料金: {event.fee} {event.currency}</p>
      <p>ステータス: <span style={{ color: event.status === 'active' ? 'green' : event.status === 'cancelled' ? 'red' : 'gray' }}>{event.status}</span></p>
      <small>作成日: {new Date(event.createdAt).toLocaleString()}</small>
      <hr />
      
      {event.status === 'active' && (
        <div style={{ marginBottom: 32, border: '1px solid #ddd', padding: 16 }}>
          <h2>RSVP申込</h2>
          <form onSubmit={handleRSVPSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label>名前:</label><br />
              <input 
                type="text" 
                value={rsvpForm.name} 
                onChange={e => setRsvpForm({...rsvpForm, name: e.target.value})}
                required 
                style={{ width: '100%', padding: 8 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>メールアドレス:</label><br />
              <input 
                type="email" 
                value={rsvpForm.email} 
                onChange={e => setRsvpForm({...rsvpForm, email: e.target.value})}
                required 
                style={{ width: '100%', padding: 8 }}
              />
            </div>
            <button type="submit" disabled={rsvpLoading} style={{ padding: '8px 16px', backgroundColor: '#007cba', color: 'white', border: 'none' }}>
              {rsvpLoading ? '申込中...' : 'RSVP申込'}
            </button>
          </form>
        </div>
      )}
      
      <h2>参加申込一覧</h2>
      <ul>
        {event.rsvps.map(rsvp => (
          <li key={rsvp.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>
              {rsvp.name} ({rsvp.email}) - <span style={{ color: rsvp.status === 'confirmed' ? 'green' : rsvp.status === 'cancelled' ? 'red' : 'gray' }}>{rsvp.status}</span>
            </span>
            {rsvp.status === 'pending' && event.status === 'active' && (
              <button 
                onClick={() => handlePayment(rsvp.id)} 
                disabled={paymentLoading}
                style={{ padding: '4px 8px', backgroundColor: '#28a745', color: 'white', border: 'none', marginLeft: 16 }}
              >
                {paymentLoading ? '処理中...' : '決済'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
