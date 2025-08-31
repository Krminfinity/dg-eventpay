"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // ログイン済みユーザーはダッシュボードへ
        router.push('/dashboard');
      } else {
        // 未ログインユーザーはウェルカムページへ
        router.push('/welcome');
      }
    }
  }, [user, isLoading, router]);

  // ローディング画面
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '20px' 
        }}>
          🎉
        </div>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#2c3e50',
          marginBottom: '16px' 
        }}>
          DG EventPay
        </h1>
        <div className="spinner"></div>
      </div>
    </div>
  );
}
