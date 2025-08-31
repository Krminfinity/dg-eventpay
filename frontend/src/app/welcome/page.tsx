"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const WelcomePage = () => {
  const router = useRouter();

  const handleCreateEvent = () => {
    router.push('/onboarding/create-event/step1');
  };

  const handleJoinEvent = () => {
    router.push('/onboarding/join-event/step1');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* ロゴ・ブランディング */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#2c3e50',
          marginBottom: '16px' 
        }}>
          🎉 DG EventPay
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#666',
          lineHeight: '1.5'
        }}>
          イベントの作成・参加が<br />
          簡単にできるアプリです
        </p>
      </div>

      {/* メインアクション */}
      <div style={{ 
        width: '100%', 
        maxWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <button
          onClick={handleCreateEvent}
          style={{
            padding: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📅</div>
            <div>イベントを作る</div>
          </div>
        </button>

        <button
          onClick={handleJoinEvent}
          style={{
            padding: '20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1e7e34';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#28a745';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎫</div>
            <div>イベントに参加する</div>
          </div>
        </button>
      </div>

      {/* 既存アカウント */}
      <div style={{ 
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <button
          onClick={() => router.push('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            fontSize: '16px',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          すでにアカウントをお持ちの方
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
