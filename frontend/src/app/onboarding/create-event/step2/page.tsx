"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DateTimeOption {
  id: string;
  date: string;
  time: string;
}

const CreateEventStep2 = () => {
  const router = useRouter();
  const [selectedDates, setSelectedDates] = useState<DateTimeOption[]>([]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddDateTime = () => {
    if (currentDate && currentTime) {
      const newOption: DateTimeOption = {
        id: Date.now().toString(),
        date: currentDate,
        time: currentTime
      };
      setSelectedDates([...selectedDates, newOption]);
      setCurrentDate('');
      setCurrentTime('');
      setShowAddForm(false);
    }
  };

  const handleRemoveDateTime = (id: string) => {
    setSelectedDates(selectedDates.filter(item => item.id !== id));
  };

  const handleNext = () => {
    if (selectedDates.length > 0) {
      const existingData = JSON.parse(localStorage.getItem('tempEventData') || '{}');
      localStorage.setItem('tempEventData', JSON.stringify({
        ...existingData,
        dateTimeOptions: selectedDates
      }));
      router.push('/onboarding/create-event/step3');
    }
  };

  const handleBack = () => {
    router.push('/onboarding/create-event/step1');
  };

  const formatDateDisplay = (date: string, time: string) => {
    const dateObj = new Date(date + 'T' + time);
    return {
      date: dateObj.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      }),
      time: dateObj.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
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
              width: '40%',
              transition: 'width 0.3s'
            }} />
          </div>
          <p style={{ 
            fontSize: '14px', 
            color: '#666', 
            marginTop: '8px',
            margin: 0
          }}>
            2 / 5
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            marginBottom: '16px',
            lineHeight: '1.3'
          }}>
            開催候補日時を<br />
            選択してください 📅
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5'
          }}>
            参加者が選択できる日程を追加できます
          </p>
        </div>

        {/* 選択済み日程一覧 */}
        {selectedDates.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#495057',
              marginBottom: '12px'
            }}>
              候補日程 ({selectedDates.length}件)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedDates.map((item) => {
                const formatted = formatDateDisplay(item.date, item.time);
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '2px solid #e9ecef'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                        {formatted.date}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {formatted.time}開始
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDateTime(item.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 日程追加フォーム */}
        {showAddForm ? (
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #007bff',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#495057',
              marginBottom: '16px'
            }}>
              日程を追加
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#495057',
                  marginBottom: '8px'
                }}>
                  開催日
                </label>
                <input
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#495057',
                  marginBottom: '8px'
                }}>
                  開始時間
                </label>
                <input
                  type="time"
                  value={currentTime}
                  onChange={(e) => setCurrentTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleAddDateTime}
                  disabled={!currentDate || !currentTime}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: (currentDate && currentTime) ? '#007bff' : '#e9ecef',
                    color: (currentDate && currentTime) ? 'white' : '#adb5bd',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (currentDate && currentTime) ? 'pointer' : 'not-allowed'
                  }}
                >
                  追加
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: 'transparent',
                    color: '#666',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              width: '100%',
              padding: '20px',
              backgroundColor: 'white',
              color: '#007bff',
              border: '2px dashed #007bff',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            + 日程を追加
          </button>
        )}

        <div style={{ flex: 1 }} />

        {/* 次へボタン */}
        <button
          onClick={handleNext}
          disabled={selectedDates.length === 0}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: selectedDates.length > 0 ? '#007bff' : '#e9ecef',
            color: selectedDates.length > 0 ? 'white' : '#adb5bd',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: selectedDates.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
        >
          次へ ({selectedDates.length}件の候補日程)
        </button>
      </div>
    </div>
  );
};

export default CreateEventStep2;
