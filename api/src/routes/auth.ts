import { Router } from 'express';
import { AuthService } from '../services/AuthService';
import { withIdempotency, checkIdempotency, completeIdempotency } from '../lib/idempotency';

export const router = Router();

// POST /auth/register - ユーザー登録
router.post('/register', withIdempotency, async (req, res) => {
  const { name, email, password } = req.body || {};
  const idempotencyKey = (req as any).idempotencyKey;

  if (!name || !email || !password) {
    return res.status(400).json({ 
      code: 'invalid_request', 
      message: 'name, email, and password are required' 
    });
  }

  try {
    // 幂等性チェック
    if (idempotencyKey) {
      const idempotencyResult = await checkIdempotency(idempotencyKey, 'auth-register');
      if (idempotencyResult.isReplay) {
        return res.status(201).json(idempotencyResult.response);
      }
    }

    const result = await AuthService.register({ name, email, password });
    
    const response = {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        status: result.user.status
      },
      token: result.token
    };

    // 幂等性キーがある場合は成功を記録
    if (idempotencyKey) {
      await completeIdempotency(idempotencyKey, response);
    }

    res.status(201).json(response);
  } catch (err: any) {
    if (err.message.includes('already exists')) {
      return res.status(409).json({ 
        code: 'user_exists', 
        message: 'User with this email already exists' 
      });
    }
    res.status(500).json({ 
      code: 'internal_error', 
      message: 'Registration failed' 
    });
  }
});

// POST /auth/login - ログイン
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ 
      code: 'invalid_request', 
      message: 'email and password are required' 
    });
  }

  try {
    const result = await AuthService.login({ email, password });
    
    res.json({
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        status: result.user.status
      },
      token: result.token
    });
  } catch (err: any) {
    if (err.message.includes('Invalid credentials')) {
      return res.status(401).json({ 
        code: 'invalid_credentials', 
        message: 'Invalid email or password' 
      });
    }
    res.status(500).json({ 
      code: 'internal_error', 
      message: 'Login failed' 
    });
  }
});

// GET /auth/me - 現在のユーザー情報取得
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      code: 'unauthorized', 
      message: 'Authorization token required' 
    });
  }

  try {
    const user = await AuthService.verifyToken(token);
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (err) {
    res.status(401).json({ 
      code: 'invalid_token', 
      message: 'Invalid or expired token' 
    });
  }
});

// POST /auth/logout - ログアウト
router.post('/logout', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      code: 'unauthorized', 
      message: 'Authorization token required' 
    });
  }

  try {
    await AuthService.logout(token);
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ 
      code: 'internal_error', 
      message: 'Logout failed' 
    });
  }
});
