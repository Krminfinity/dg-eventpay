"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorMessage from '../../../../components/ErrorMessage';

const CreateEventStep1 = () => {
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    // バリデーション
    if (!eventName.trim()) {
      setError('イベント名を入力してください');
      return;
    }
    
    if (eventName.trim().length < 3) {
      setError('イベント名は3文字以上で入力してください');
      return;
    }

    if (eventName.trim().length > 100) {
      setError('イベント名は100文字以内で入力してください');
      return;
    }

    // 正常な場合はエラーをクリア
    setError('');

    if (eventName.trim()) {
      localStorage.setItem('tempEventData', JSON.stringify({ name: eventName }));
      router.push('/onboarding/create-event/step2');
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
              backgroundColor: '#007bff',
              borderRadius: '2px',
              width: '20%',
              transition: 'width 0.3s'
            }} />
          </div>
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginTop: '8px',
            margin: 0
          }}>
            1 / 5
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
            イベント名を<br />
            教えてください 📝
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5'
          }}>
            後から変更することもできます
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
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="例: DG技術勉強会 #1"
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

        {/* 次へボタン */}
        <button
          onClick={handleNext}
          disabled={!eventName.trim()}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: eventName.trim() ? '#007bff' : '#e9ecef',
            color: eventName.trim() ? 'white' : '#adb5bd',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: eventName.trim() ? 'pointer' : 'not-allowed',
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

export default CreateEventStep1;
