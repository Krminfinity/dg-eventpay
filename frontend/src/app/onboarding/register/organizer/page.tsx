"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ErrorMessage from '@/components/ErrorMessage';

const OrganizerRegisterPage = () => {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [eventData, setEventData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('tempEventData');
    if (data) {
      setEventData(JSON.parse(data));
    }
  }, []);

  const validateForm = () => {
    if (!password) {
      return 'パスワードを入力してください';
    }
    if (password.length < 6) {
      return 'パスワードは6文字以上で入力してください';
    }
    if (!confirmPassword) {
      return 'パスワード（確認）を入力してください';
    }
    if (password !== confirmPassword) {
      return 'パスワードが一致しません';
    }
    return '';
  };

  const handleRegister = async () => {
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!eventData) {
      setError('イベントデータが見つかりません。最初からやり直してください。');
      return;
    }

    try {
      await register({
        name: eventData.organizerName,
        email: eventData.email,
        password,
        role: 'organizer'
      });

      // イベント作成処理（実際はAPI呼び出し）
      console.log('Creating event:', eventData);
      
      // 一時データクリア
      localStorage.removeItem('tempEventData');
      
      // 決済情報入力画面へ
      router.push('/onboarding/payment-setup');
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // エラーメッセージを詳細に分類
      if (err.message) {
        if (err.message.includes('email')) {
          setError('このメールアドレスは既に使用されています');
        } else if (err.message.includes('password')) {
          setError('パスワードの形式が正しくありません');
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          setError('ネットワークエラーが発生しました。インターネット接続を確認してください');
        } else {
          setError(err.message);
        }
      } else {
        setError('会員登録に失敗しました。しばらく待ってからもう一度お試しください');
      }
    }
  };

  const handleBack = () => {
    router.push('/onboarding/create-event/step5');
  };

  if (!eventData) {
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
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#495057',
          margin: 0
        }}>
          会員登録
        </h2>
      </div>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* イベント情報確認 */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            marginBottom: '12px'
          }}>
            作成するイベント
          </h3>
          <div style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
            <p><strong>{eventData.name}</strong></p>
            <p>{eventData.date} {eventData.time}開始</p>
            <p>参加費: ¥{eventData.fee?.toLocaleString() || '0'}</p>
            <p>主催者: {eventData.organizerName}</p>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            marginBottom: '16px',
            lineHeight: '1.3'
          }}>
            パスワードを<br />
            設定してください 🔒
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5'
          }}>
            6文字以上で設定してください
          </p>
        </div>

        {/* エラーメッセージ */}
        <ErrorMessage 
          message={error} 
          onClose={() => setError('')}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード（6文字以上）"
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '18px',
              border: error && error.includes('パスワード') ? '2px solid #dc3545' : '2px solid #e9ecef',
              borderRadius: '12px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error && error.includes('パスワード') ? '#dc3545' : '#e9ecef';
            }}
            autoFocus
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="パスワード（確認）"
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '18px',
              border: error && error.includes('一致') ? '2px solid #dc3545' : '2px solid #e9ecef',
              borderRadius: '12px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error && error.includes('一致') ? '#dc3545' : '#e9ecef';
            }}
          />
        </div>

        {/* 登録ボタン */}
        <button
          onClick={handleRegister}
          disabled={loading || password.length < 6 || password !== confirmPassword}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: (!loading && password.length >= 6 && password === confirmPassword) ? '#007bff' : '#e9ecef',
            color: (!loading && password.length >= 6 && password === confirmPassword) ? 'white' : '#adb5bd',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: (!loading && password.length >= 6 && password === confirmPassword) ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            marginTop: '20px'
          }}
        >
          {loading ? '登録中...' : '会員登録を完了する'}
        </button>
      </div>
    </div>
  );
};

export default OrganizerRegisterPage;
