"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const MobileHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <header style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px 16px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* ロゴ */}
        <div 
          onClick={() => navigateTo('/dashboard')}
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          DG EventPay
        </div>

        {/* ユーザー情報 */}
        {user && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px'
          }}>
            <span style={{ 
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
