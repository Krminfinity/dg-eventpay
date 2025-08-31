"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import MobileHeader from '@/components/MobileHeader';
import MobileBottomNav from '@/components/MobileBottomNav';

interface Event {
  id: string;
  name: string;
  description?: string;
  fee: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  rsvps: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
  }>;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalEvents: number;
  activeEvents: number;
  totalPayments: number;
  totalAmount: number;
  pendingPayments: number;
}

const DashboardPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    activeEvents: 0,
    totalPayments: 0,
    totalAmount: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      
      // イベント一覧取得
      const eventsRes = await fetch(`${API_BASE}/events`);
      const eventsData = await eventsRes.json();
      const eventsList = eventsData.events || [];
      
      // 支払い履歴取得
      const paymentsRes = await fetch(`${API_BASE}/payments`);
      const paymentsData = await paymentsRes.json();
      const paymentsList = paymentsData.payments || [];

      setEvents(eventsList);
      setPayments(paymentsList);

      // 統計情報計算
      const activeEvents = eventsList.filter((e: Event) => e.status === 'active').length;
      const totalAmount = paymentsList
        .filter((p: Payment) => p.status === 'succeeded')
        .reduce((sum: number, p: Payment) => sum + p.amount, 0);
      const pendingPayments = eventsList
        .flatMap((e: Event) => e.rsvps)
        .filter((rsvp: { status: string }) => rsvp.status === 'pending').length;

      setStats({
        totalEvents: eventsList.length,
        activeEvents,
        totalPayments: paymentsList.length,
        totalAmount,
        pendingPayments
      });
    } catch (err) {
      console.error('ダッシュボードデータの取得に失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <div className="spinner"></div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <MobileHeader />
        
        <main className="container mobile-content" style={{ paddingTop: '20px' }}>
          {/* ウェルカムメッセージ */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#2c3e50' }}>
              こんにちは、{user?.name}さん！
            </h1>
            <p style={{ color: '#666', margin: 0 }}>
              イベント管理ダッシュボードへようこそ
            </p>
          </div>

          {/* 統計カード */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '12px', 
            marginBottom: '24px' 
          }}>
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '4px' }}>
                {stats.totalEvents}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>総イベント数</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745', marginBottom: '4px' }}>
                {stats.activeEvents}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>開催中</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107', marginBottom: '4px' }}>
                ¥{stats.totalAmount.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>総売上</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545', marginBottom: '4px' }}>
                {stats.pendingPayments}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>未払い</div>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#2c3e50' }}>
              クイックアクション
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <button
                onClick={() => router.push('/events/new')}
                className="btn btn-primary"
                style={{ padding: '16px 12px', fontSize: '14px' }}
              >
                📅 新規イベント
              </button>
              <button
                onClick={() => router.push('/events')}
                className="btn btn-secondary"
                style={{ padding: '16px 12px', fontSize: '14px' }}
              >
                📋 イベント管理
              </button>
              <button
                onClick={() => router.push('/payments')}
                className="btn btn-secondary"
                style={{ padding: '16px 12px', fontSize: '14px' }}
              >
                💳 支払い確認
              </button>
              <button
                onClick={() => router.push('/refunds')}
                className="btn btn-secondary"
                style={{ padding: '16px 12px', fontSize: '14px' }}
              >
                💸 返金管理
              </button>
            </div>
          </div>

          {/* 最近のイベント */}
          <div className="card">
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#2c3e50' }}>
              最近のイベント
            </h2>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                まだイベントがありません
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => router.push(`/events/${event.id}`)}
                    style={{
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px', color: '#2c3e50' }}>
                          {event.name}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                          ¥{event.fee.toLocaleString()} • {event.rsvps.length}名参加
                        </p>
                      </div>
                      <span style={{
                        backgroundColor: event.status === 'active' ? '#d4edda' : '#f8d7da',
                        color: event.status === 'active' ? '#155724' : '#721c24',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {event.status === 'active' ? '開催中' : '終了'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <MobileBottomNav currentPath="/dashboard" />
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;
