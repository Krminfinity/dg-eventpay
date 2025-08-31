"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const PaymentSetupPage = () => {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const handleComplete = () => {
    // 決済情報保存処理（実際はStripe等のAPI）
    console.log('Payment setup:', { cardNumber, expiryDate, cvv, cardName });
    
    // ダッシュボードへリダイレクト
    router.push('/dashboard');
  };

  const handleSkip = () => {
    // スキップして後で設定
    router.push('/dashboard');
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.substring(0, 19); // 16桁 + 3スペース
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const isFormValid = () => {
    return cardNumber.replace(/\s/g, '').length === 16 &&
           expiryDate.length === 5 &&
           cvv.length === 3 &&
           cardName.trim().length > 0;
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
        paddingTop: '20px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#495057',
          margin: 0
        }}>
          決済情報設定
        </h2>
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
            クレジットカード情報を<br />
            登録しますか？ 💳
          </h1>
          <p style={{ 
            fontSize: '16px', 
            color: '#666',
            lineHeight: '1.5'
          }}>
            イベントの支払いに使用されます。<br />
            後から設定することも可能です。
          </p>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#495057',
              marginBottom: '8px'
            }}>
              カード番号
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '18px',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
                letterSpacing: '1px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#495057',
                marginBottom: '8px'
              }}>
                有効期限
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '18px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  textAlign: 'center'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#007bff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
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
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                placeholder="123"
                maxLength={3}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '18px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  textAlign: 'center'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#007bff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#495057',
              marginBottom: '8px'
            }}>
              カード名義
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="YAMADA TARO"
              style={{
                width: '100%',
                padding: '18px',
                fontSize: '18px',
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
                textTransform: 'uppercase'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#007bff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
          </div>
        </div>

        {/* ボタン */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '30px' }}>
          <button
            onClick={handleComplete}
            disabled={!isFormValid()}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: isFormValid() ? '#007bff' : '#e9ecef',
              color: isFormValid() ? 'white' : '#adb5bd',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            カード情報を登録する
          </button>

          <button
            onClick={handleSkip}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#adb5bd';
              e.currentTarget.style.color = '#495057';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e9ecef';
              e.currentTarget.style.color = '#666';
            }}
          >
            後で設定する
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSetupPage;
