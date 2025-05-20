import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { LoginDto, CreateUserDto } from '../types/auth';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async createUser(req: Request, res: Response) {
    try {
      // Check if the requesting user is an admin
      if (!req.user || !(await this.authService.isAdmin(req.user.userId))) {
        return res.status(403).json({ message: 'Only admins can create new users' });
      }

      const createUserDto: CreateUserDto = req.body;
      const result = await this.authService.createUser(createUserDto);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const loginDto: LoginDto = req.body;
      const result = await this.authService.login(loginDto);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}