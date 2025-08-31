"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ダミーイベントデータ
const dummyEvents: Record<string, any> = {
  'abc123': {
    id: 'abc123',
    name: 'DG技術勉強会 #1',
    organizer: 'DG技術部',
    fee: 2000,
    dates: [
      { id: '1', date: '2025-09-15', time: '19:00', available: true },
      { id: '2', date: '2025-09-22', time: '19:00', available: true },
      { id: '3', date: '2025-09-29', time: '19:00', available: false }
    ]
  },
  'def456': {
    id: 'def456',
    name: 'DGネットワーキング懇親会',
    organizer: '田中次郎',
    fee: 3500,
    dates: [
      { id: '4', date: '2025-09-20', time: '18:30', available: true },
      { id: '5', date: '2025-09-27', time: '18:30', available: true }
    ]
  }
};

const JoinEventStep2 = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const joinData = localStorage.getItem('tempJoinData');
    if (joinData) {
      const { eventId } = JSON.parse(joinData);
      // ダミーデータから取得（実際はAPI呼び出し）
      const event = dummyEvents[eventId] || dummyEvents['abc123'];
      setEventData(event);
    }
    setLoading(false);
  }, []);

  const handleNext = () => {
    if (selectedDate) {
      const joinData = JSON.parse(localStorage.getItem('tempJoinData') || '{}');
      localStorage.setItem('tempJoinData', JSON.stringify({
        ...joinData,
        selectedDate,
        eventData
      }));
      router.push('/onboarding/join-event/step3');
    }
  };

  const handleBack = () => {
    router.push('/onboarding/join-event/step1');
  };

  if (loading || !eventData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

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
              width: '50%',
              transition: 'width 0.3s'
            }} />
          </div>
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginTop: '8px',
            margin: 0
          }}>
            2 / 4
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* イベント情報 */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            marginBottom: '8px'
          }}>
            {eventData.name}
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            marginBottom: '8px'
          }}>
            主催者: {eventData.organizer}
          </p>
          <p style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#007bff',
            margin: 0
          }}>
            参加費: ¥{eventData.fee.toLocaleString()}
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            marginBottom: '16px',
            lineHeight: '1.3'
          }}>
            参加可能な日程を<br />
            選択してください 📅
          </h1>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {eventData.dates.map((dateOption: any) => (
            <button
              key={dateOption.id}
              onClick={() => dateOption.available && setSelectedDate(dateOption.id)}
              disabled={!dateOption.available}
              style={{
                width: '100%',
                padding: '20px',
                backgroundColor: !dateOption.available 
                  ? '#f8f9fa' 
                  : selectedDate === dateOption.id 
                    ? '#28a745' 
                    : 'white',
                color: !dateOption.available 
                  ? '#adb5bd' 
                  : selectedDate === dateOption.id 
                    ? 'white' 
                    : '#2c3e50',
                border: selectedDate === dateOption.id 
                  ? '2px solid #28a745' 
                  : '2px solid #e9ecef',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: dateOption.available ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                  {new Date(dateOption.date).toLocaleDateString('ja-JP', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </div>
                <div style={{ fontSize: '16px', opacity: 0.8 }}>
                  {dateOption.time}開始
                </div>
              </div>
              <div style={{ fontSize: '20px' }}>
                {!dateOption.available ? '❌' : selectedDate === dateOption.id ? '✅' : ''}
              </div>
            </button>
          ))}
        </div>

        {/* 次へボタン */}
        <button
          onClick={handleNext}
          disabled={!selectedDate}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: selectedDate ? '#28a745' : '#e9ecef',
            color: selectedDate ? 'white' : '#adb5bd',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: selectedDate ? 'pointer' : 'not-allowed',
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

export default JoinEventStep2;
