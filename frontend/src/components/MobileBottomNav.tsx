"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface MobileBottomNavProps {
  currentPath?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath = '' }) => {
  const router = useRouter();

  const navItems = [
    {
      path: '/dashboard',
      icon: '🏠',
      label: 'ホーム',
      active: currentPath === '/dashboard'
    },
    {
      path: '/events',
      icon: '📅',
      label: 'イベント',
      active: currentPath.startsWith('/events')
    },
    {
      path: '/payments',
      icon: '💳',
      label: '支払い',
      active: currentPath === '/payments'
    },
    {
      path: '/refunds',
      icon: '💸',
      label: '返金',
      active: currentPath === '/refunds'
    }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e9ecef',
      padding: '8px 0',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 12px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'color 0.2s',
              color: item.active ? '#007bff' : '#666',
              fontSize: '12px',
              minWidth: '60px'
            }}
          >
            <span style={{ 
              fontSize: '20px', 
              marginBottom: '4px',
              filter: item.active ? 'none' : 'grayscale(1)'
            }}>
              {item.icon}
            </span>
            <span style={{ 
              fontSize: '11px',
              fontWeight: item.active ? '600' : '400'
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
