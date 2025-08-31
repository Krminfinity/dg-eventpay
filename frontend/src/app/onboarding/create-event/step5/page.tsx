"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorMessage from '../../../../components/ErrorMessage';

const CreateEventStep5 = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNext = () => {
    // バリデーション
    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }
    
    if (!validateEmail(email.trim())) {
      setError('正しいメールアドレスの形式で入力してください');
      return;
    }

    // 正常な場合はエラーをクリア
    setError('');

    if (email.trim() && email.includes('@')) {
      const existingData = JSON.parse(localStorage.getItem('tempEventData') || '{}');
      localStorage.setItem('tempEventData', JSON.stringify({
        ...existingData,
        email: email
      }));
      router.push('/onboarding/register/organizer');
    }
  };

  const handleBack = () => {
    router.push('/onboarding/create-event/step4');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
    }}>
      {/* ヘッダー */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        marginBottom: '40px',
        paddingTop: '20px'
      }}>
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            marginRight: '16px'
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ 
            height: '4px', 
            backgroundColor: '#e9ecef', 
            borderRadius: '2px',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#007bff',
              borderRadius: '2px',
              width: '100%',
              transition: 'width 0.3s'
            }} />
          </div>
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginTop: '8px',
            margin: 0
          }}>
            5 / 5
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            marginBottom: '16px',
            lineHeight: '1.3'
          }}>
            メールアドレスを<br />
            教えてください ✉️
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5'
          }}>
            イベント管理やお知らせに使用します
          </p>
        </div>

        {/* エラーメッセージ */}
        <ErrorMessage 
          message={error} 
          onClose={() => setError('')}
        />

        <div style={{ flex: 1 }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="例: yamada@example.com"
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '18px',
              border: error ? '2px solid #dc3545' : '2px solid #e9ecef',
              borderRadius: '12px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? '#dc3545' : '#e9ecef';
            }}
            autoFocus
          />
        </div>

        {/* イベント作成ボタン */}
        <button
          onClick={handleNext}
          disabled={!email.trim() || !email.includes('@')}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: (email.trim() && email.includes('@')) ? '#28a745' : '#e9ecef',
            color: (email.trim() && email.includes('@')) ? 'white' : '#adb5bd',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: (email.trim() && email.includes('@')) ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            marginTop: '20px'
          }}
        >
          🎉 イベントを作成する
        </button>
      </div>
    </div>
  );
};

export default CreateEventStep5;
