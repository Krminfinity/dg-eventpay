"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorMessage from '../../../../components/ErrorMessage';

const JoinEventStep1 = () => {
  const router = useRouter();
  const [eventUrl, setEventUrl] = useState('');
  const [error, setError] = useState('');

  const validateEventUrl = (url: string) => {
    // 簡単なURL形式チェック
    return url.includes('eventpay') || url.includes('http') || url.length > 5;
  };

  const handleNext = () => {
    // バリデーション
    if (!eventUrl.trim()) {
      setError('イベントURLまたはIDを入力してください');
      return;
    }
    
    if (!validateEventUrl(eventUrl.trim())) {
      setError('正しいイベントURLまたはIDを入力してください');
      return;
    }

    // 正常な場合はエラーをクリア
    setError('');

    if (eventUrl.trim()) {
      // URLからイベントIDを抽出（簡易版）
      const eventId = eventUrl.split('/').pop() || eventUrl;
      localStorage.setItem('tempJoinData', JSON.stringify({ eventId }));
      router.push('/onboarding/join-event/step2');
    }
  };

  const handleBack = () => {
    router.push('/welcome');
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
              backgroundColor: '#28a745',
              borderRadius: '2px',
              width: '25%',
              transition: 'width 0.3s'
            }} />
          </div>
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginTop: '8px',
            margin: 0
          }}>
            1 / 4
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
            イベントのURLまたは<br />
            IDを入力してください 🔗
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5'
          }}>
            主催者から送られてきたURLを貼り付けてください
          </p>
        </div>

        {/* エラーメッセージ */}
        <ErrorMessage 
          message={error} 
          onClose={() => setError('')}
        />

        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={eventUrl}
            onChange={(e) => setEventUrl(e.target.value)}
            placeholder="https://eventpay.dg.com/event/abc123 または abc123"
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
              e.target.style.borderColor = '#28a745';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? '#dc3545' : '#e9ecef';
            }}
            autoFocus
          />
        </div>

        {/* 次へボタン */}
        <button
          onClick={handleNext}
          disabled={!eventUrl.trim()}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: eventUrl.trim() ? '#28a745' : '#e9ecef',
            color: eventUrl.trim() ? 'white' : '#adb5bd',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: eventUrl.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            marginTop: '20px'
          }}
        >
          次へ
        </button>
      </div>
    </div>
  );
};

export default JoinEventStep1;
