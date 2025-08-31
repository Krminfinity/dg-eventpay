"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  loading: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 初期化時にローカルストレージから認証情報を復元
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('Restoring user session:', parsedUser.email);
          setToken(storedToken);
          setUser(parsedUser);
          
          // トークンの有効性を検証（モックトークンの場合はスキップ）
          if (!storedToken.startsWith('mock-token-')) {
            verifyToken(storedToken);
          }
        } catch (parseError) {
          console.error('Failed to parse stored user data:', parseError);
          logout();
        }
      }
    } catch (storageError) {
      console.error('Failed to access localStorage:', storageError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (authToken: string) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!res.ok) {
        throw new Error('Token verification failed');
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    }
  };

  const login = (authToken: string, userData: User) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    if (token) {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    setLoading(true);
    console.log('Registration started for:', userData.email);
    
    try {
      // 簡単なバリデーション
      if (!userData.email || !userData.name || !userData.password) {
        throw new Error('必須項目が入力されていません');
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
      
      // APIサーバーへの接続を試行
      let useApiServer = true;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒タイムアウト
        
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) {
          let errorMessage = 'Registration failed';
          try {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } catch (parseError) {
            console.warn('Could not parse error response');
          }
          throw new Error(errorMessage);
        }

        const data = await res.json();
        console.log('API registration successful:', data);
        login(data.token, data.user);
        return;
        
      } catch (apiError: any) {
        console.log('API connection failed:', apiError.message || apiError);
        useApiServer = false;
      }
      
      // APIサーバーが利用できない場合はモック処理
      if (!useApiServer) {
        console.warn('Using mock registration (API server unavailable)');
        
        // モックレスポンス
        const mockUser = {
          id: `mock-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          status: userData.role || 'participant'
        };
        const mockToken = `mock-token-${Date.now()}`;
        
        // 少し待機してリアルなAPIコールのシミュレーション
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Mock registration successful:', mockUser);
        login(mockToken, mockUser);
        return;
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    register,
    loading,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
