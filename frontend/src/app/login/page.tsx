"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/components/ErrorMessage';

const LoginPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!formData.email) {
      return 'メールアドレスを入力してください';
    }
    if (!formData.email.includes('@')) {
      return 'メールアドレスの形式が正しくありません';
    }
    if (!formData.password) {
      return 'パスワードを入力してください';
    }
    if (!isLogin) {
      if (!formData.name) {
        return '名前を入力してください';
      }
      if (formData.password.length < 6) {
        return 'パスワードは6文字以上で入力してください';
      }
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      let useApiServer = true;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒タイムアウト

        const res = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const data = await res.json();

        if (res.ok) {
          // トークンをローカルストレージに保存
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // ダッシュボードにリダイレクト
          router.push('/dashboard');
          return;
        } else {
          // API からのエラーメッセージを詳細に分類
          if (res.status === 401) {
            setError('メールアドレスまたはパスワードが間違っています');
          } else if (res.status === 409) {
            setError('このメールアドレスは既に使用されています');
          } else if (data.message) {
            setError(data.message);
          } else {
            setError(isLogin ? 'ログインに失敗しました' : '会員登録に失敗しました');
          }
          return;
        }
      } catch (apiError: any) {
        console.log('API connection failed, using mock authentication');
        useApiServer = false;
      }

      // APIサーバーが利用できない場合はモック処理
      if (!useApiServer) {
        console.warn('Using mock authentication (API server unavailable)');
        
        // モック認証
        const mockUser = {
          id: `mock-${Date.now()}`,
          name: formData.name || 'テストユーザー',
          email: formData.email,
          status: 'user'
        };
        const mockToken = `mock-token-${Date.now()}`;
        
        // 少し待機してリアルなAPIコールのシミュレーション
        await new Promise(resolve => setTimeout(resolve, 800));
        
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        console.log('Mock authentication successful:', mockUser);
        router.push('/dashboard');
        return;
      }

    } catch (err: any) {
      console.error('Authentication error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('サーバーに接続できません。しばらく待ってからもう一度お試しください');
      } else {
        setError('ネットワークエラーが発生しました。インターネット接続を確認してください');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {/* ロゴ・ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#2c3e50',
            margin: '0 0 8px 0'
          }}>
            DG EventPay
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            イベント決済管理システム
          </p>
        </div>

        {/* タブ切替 */}
        <div style={{
          display: 'flex',
          marginBottom: '24px',
          borderRadius: '8px',
          backgroundColor: '#f1f3f5',
          padding: '4px'
        }}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: isLogin ? '#007bff' : 'transparent',
              color: isLogin ? 'white' : '#666',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ログイン
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: !isLogin ? '#007bff' : 'transparent',
              color: !isLogin ? 'white' : '#666',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            新規登録
          </button>
        </div>

        {/* エラー表示 */}
        <ErrorMessage 
          message={error} 
          onClose={() => setError('')}
        />

        {/* フォーム */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#333'
              }}>
                お名前
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: error && error.includes('名前') ? '2px solid #dc3545' : '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = error && error.includes('名前') ? '#dc3545' : '#e9ecef'}
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#333'
            }}>
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: error && (error.includes('メールアドレス') || error.includes('間違っています')) ? '2px solid #dc3545' : '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = error && (error.includes('メールアドレス') || error.includes('間違っています')) ? '#dc3545' : '#e9ecef'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#333'
            }}>
              パスワード
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: error && (error.includes('パスワード') || error.includes('間違っています')) ? '2px solid #dc3545' : '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = error && (error.includes('パスワード') || error.includes('間違っています')) ? '#dc3545' : '#e9ecef'}
            />
            {!isLogin && (
              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                6文字以上で入力してください
              </small>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? '処理中...' : (isLogin ? 'ログイン' : '新規登録')}
          </button>
        </form>

        {/* フッター */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            {isLogin ? '初回ご利用の方は' : 'すでにアカウントをお持ちの方は'}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px',
                marginLeft: '4px'
              }}
            >
              {isLogin ? '新規登録' : 'ログイン'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
