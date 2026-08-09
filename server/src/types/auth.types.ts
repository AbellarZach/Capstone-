import { Request } from "express";

export interface RegisterDto {
  email: string;
  username: string;
  phoneNumber?: string;
  password?: string;
  fullname?: string;
}

export interface LoginDto {
  username: string;
  password?: string;
}

export interface TokenPayload {
  id: number;
  username: string;
  role: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  fullname?: string | null;
  phoneNumber?: string | null;
  isVerified: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}
