"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // ログイン済みの場合はダッシュボードへ
        router.push('/dashboard');
      } else {
        // 未ログインの場合はログインページへ
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  // ローディング中の表示
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px'
      }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '8px' }}>
          DG EventPay
        </h1>
        <p style={{ color: '#666', margin: 0 }}>読み込み中...</p>
      </div>
    </div>
  );
};

export default HomePage;
