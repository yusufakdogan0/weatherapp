import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { LoginDto, CreateUserDto } from '../types/auth';

const prisma = new PrismaClient();

export class AuthService {
  private readonly JWT_SECRET: Secret;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    this.JWT_SECRET = process.env.JWT_SECRET;
  }
  private readonly JWT_EXPIRES_IN = '7d' as const;

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, name, role } = createUserDto;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string; email: string; role: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    return user?.role === 'ADMIN';
  }
}