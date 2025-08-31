import { prisma } from '../lib/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface RegisterArgs {
  name: string;
  email: string;
  password: string;
}

export interface LoginArgs {
  email: string;
  password: string;
}

export interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
  token: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const TOKEN_EXPIRY = '24h';

export class AuthService {
  static async register(args: RegisterArgs): Promise<AuthResult> {
    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: args.email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(args.password, 12);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        name: args.name,
        email: args.email,
        passwordHash: hashedPassword,
        status: 'active'
      }
    });

    // JWT生成
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      },
      token
    };
  }

  static async login(args: LoginArgs): Promise<AuthResult> {
    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email: args.email }
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    // パスワード検証
    const isValid = await bcrypt.compare(args.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // アクティブユーザーチェック
    if (user.status !== 'active') {
      throw new Error('Account is not active');
    }

    // JWT生成
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      },
      token
    };
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // ユーザーが存在し、アクティブか確認
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || user.status !== 'active') {
        throw new Error('User not found or inactive');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status
      };
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  static async logout(token: string): Promise<void> {
    // 現在はステートレスJWTのため、クライアント側でトークン削除
    // 将来的にはブラックリストやリフレッシュトークンの無効化を実装
    console.log('Logout requested for token:', token.substring(0, 20) + '...');
  }
}
