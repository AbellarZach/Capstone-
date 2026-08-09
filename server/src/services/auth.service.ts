import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { RegisterDto, LoginDto, AuthUser } from "../types/auth.types";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { generateRandomToken } from "../utils/token";
import { TokenType } from "@prisma/client";

function toAuthUser(user: any): AuthUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    fullname: user.fullname,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified,
  };
}

export class AuthService {
  static async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const username = dto.username.trim();
    const phoneNumber = dto.phoneNumber?.trim() || null;
    const password = dto.password;

    if (!email || !username || !password) {
      throw new Error("Email, username, and password are required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // Check duplicate email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new Error("Email is already registered");
    }

    // Check duplicate username
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      throw new Error("Username is already taken");
    }

    // Check duplicate phone number
    if (phoneNumber) {
      const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
      if (existingPhone) {
        throw new Error("Phone number is already registered");
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with STRICTLY FORCED role = RESIDENT
    const user = await prisma.user.create({
      data: {
        email,
        username,
        fullname: dto.fullname || null,
        phoneNumber,
        password: passwordHash,
        role: "RESIDENT",
        isVerified: false,
      },
    });

    // Create email verification token
    const verifyToken = generateRandomToken();
    await prisma.token.create({
      data: {
        type: TokenType.EMAIL_VERIFY,
        token: verifyToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    return {
      user: toAuthUser(user),
      verifyToken,
    };
  }

  static async login(dto: LoginDto) {
    const { username, password } = dto;
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username.toLowerCase() }],
      },
    });

    if (!user || !user.password) {
      throw new Error("Invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid username or password");
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token to database
    await prisma.token.create({
      data: {
        type: TokenType.REFRESH,
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: toAuthUser(user),
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error("Invalid or expired refresh token");
    }

    const storedToken = await prisma.token.findUnique({
      where: { token: refreshToken },
    });

    if (
      !storedToken ||
      storedToken.type !== TokenType.REFRESH ||
      storedToken.revokedAt ||
      storedToken.consumedAt ||
      storedToken.expiresAt < new Date()
    ) {
      throw new Error("Refresh token revoked or expired");
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      accessToken: newAccessToken,
      user: toAuthUser(user),
    };
  }

  static async logout(refreshToken: string) {
    if (!refreshToken) return;
    try {
      await prisma.token.updateMany({
        where: { token: refreshToken, type: TokenType.REFRESH },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Ignore if token doesn't exist
    }
  }

  static async verifyEmail(tokenString: string) {
    const tokenRecord = await prisma.token.findUnique({
      where: { token: tokenString },
    });

    if (
      !tokenRecord ||
      tokenRecord.type !== TokenType.EMAIL_VERIFY ||
      tokenRecord.revokedAt ||
      tokenRecord.consumedAt ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new Error("Invalid or expired email verification token");
    }

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { isVerified: true },
    });

    await prisma.token.update({
      where: { id: tokenRecord.id },
      data: { consumedAt: new Date() },
    });

    return true;
  }

  static async forgotPassword(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: "If account exists, password reset instructions have been sent." };
    }

    const resetToken = generateRandomToken();
    await prisma.token.create({
      data: {
        type: TokenType.PASSWORD_RESET,
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    return {
      message: "If account exists, password reset instructions have been sent.",
      resetToken,
    };
  }

  static async resetPassword(tokenString: string, newPassword?: string) {
    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const tokenRecord = await prisma.token.findUnique({
      where: { token: tokenString },
    });

    if (
      !tokenRecord ||
      tokenRecord.type !== TokenType.PASSWORD_RESET ||
      tokenRecord.revokedAt ||
      tokenRecord.consumedAt ||
      tokenRecord.expiresAt < new Date()
    ) {
      throw new Error("Invalid or expired password reset token");
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: passwordHash },
    });

    await prisma.token.update({
      where: { id: tokenRecord.id },
      data: { consumedAt: new Date() },
    });

    // Revoke all refresh tokens for security
    await prisma.token.updateMany({
      where: { userId: tokenRecord.userId, type: TokenType.REFRESH },
      data: { revokedAt: new Date() },
    });

    return true;
  }

  static async googleAuth(googleData: { googleId: string; email: string; fullname?: string }) {
    const { googleId, email, fullname } = googleData;
    const normalizedEmail = email.toLowerCase().trim();

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email: normalizedEmail }],
      },
    });

    if (!user) {
      const baseUsername = normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      const username = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          username,
          fullname: fullname || baseUsername,
          googleId,
          role: "RESIDENT", // NEVER create ADMIN via Google
          isVerified: true,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, isVerified: true },
      });
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.token.create({
      data: {
        type: TokenType.REFRESH,
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: toAuthUser(user),
      accessToken,
      refreshToken,
    };
  }
}
