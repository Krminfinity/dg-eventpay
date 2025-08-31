"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateEventStep3 = () => {
  const router = useRouter();
  const [eventFee, setEventFee] = useState('');

  const handleNext = () => {
    const existingData = JSON.parse(localStorage.getItem('tempEventData') || '{}');
    localStorage.setItem('tempEventData', JSON.stringify({
      ...existingData,
      fee: eventFee ? parseInt(eventFee) : 0
    }));
    router.push('/onboarding/create-event/step4');
  };

  const handleBack = () => {
    router.push('/onboarding/create-event/step2');
  };

  const handleFreeEvent = () => {
    setEventFee('0');
    const existingData = JSON.parse(localStorage.getItem('tempEventData') || '{}');
    localStorage.setItem('tempEventData', JSON.stringify({
      ...existingData,
      fee: 0
    }));
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
              width: '60%',
              transition: 'width 0.3s'
            }} />
          </div>
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginTop: '8px',
            margin: 0
          }}>
            3 / 5
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
            参加費は<br />
            いくらですか？ 💰
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5'
          }}>
            無料の場合は「無料にする」を選択してください
          </p>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: '#666',
              zIndex: 1
            }}>
              ¥
            </span>
            <input
              type="number"
              value={eventFee}
              onChange={(e) => setEventFee(e.target.value)}
              placeholder="3000"
              min="0"
              style={{
                width: '100%',
                padding: '20px 20px 20px 40px',
                fontSize: '18px',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
              autoFocus
            />
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <span style={{ 
              fontSize: '16px', 
              color: '#adb5bd',
              position: 'relative'
            }}>
              または
            </span>
          </div>

          <button
            onClick={handleFreeEvent}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e7e34';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#28a745';
            }}
          >
            🎉 無料にする
          </button>
        </div>

        {/* 次へボタン */}
        <button
          onClick={handleNext}
          disabled={!eventFee || parseInt(eventFee) < 0}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: (eventFee && parseInt(eventFee) >= 0) ? '#007bff' : '#e9ecef',
            color: (eventFee && parseInt(eventFee) >= 0) ? 'white' : '#adb5bd',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: (eventFee && parseInt(eventFee) >= 0) ? 'pointer' : 'not-allowed',
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

export default CreateEventStep3;
