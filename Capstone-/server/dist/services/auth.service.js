"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
const token_1 = require("../utils/token");
const mailer_1 = require("../utils/mailer");
const residentMatch_1 = require("../utils/residentMatch");
const client_1 = require("@prisma/client");
function toAuthUser(user) {
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
class AuthService {
    static async register(dto) {
        const fullname = String(dto.fullname ?? "").trim();
        const email = (0, residentMatch_1.normalizeEmail)(dto.email ?? "");
        const username = String(dto.username ?? "").trim();
        const phoneNumber = String(dto.phoneNumber ?? "").trim();
        const password = dto.password;
        // Any frontend-supplied residentId/userId is deliberately ignored:
        // identity must be proven via Full Name + Email + Phone.
        if (!fullname || !email || !username || !phoneNumber || !password) {
            throw new Error("Full name, email, phone number, username, and password are required");
        }
        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters");
        }
        const normName = (0, residentMatch_1.normalizeFullName)(fullname);
        const normPhone = (0, residentMatch_1.normalizePhone)(phoneNumber);
        if (!normPhone) {
            throw new Error("Phone number is not valid");
        }
        // Exact match: ONE resident where normalized Full Name + Email + Phone
        // all point to the SAME record. Username, password and address are
        // never used for matching.
        const residents = await prisma_1.default.resident.findMany({
            include: { user: { select: { id: true } } },
        });
        const matches = residents.filter((r) => {
            const residentPhone = (0, residentMatch_1.normalizePhone)(r.contactNumber ?? "");
            return ((0, residentMatch_1.normalizeFullName)(r.fullName ?? "") === normName &&
                (0, residentMatch_1.normalizeEmail)(r.email ?? "") === email &&
                residentPhone !== "" &&
                residentPhone === normPhone);
        });
        if (matches.length === 0) {
            throw new Error("Your information could not be verified. Please make sure your name, email, and contact number match the information registered with the barangay.");
        }
        if (matches.length > 1) {
            throw new Error("Multiple resident records match your information. Please contact the barangay for verification.");
        }
        const matched = matches[0];
        if (matched.user) {
            throw new Error("This resident is already registered. You cannot create another account.");
        }
        // Check duplicate email
        const existingEmail = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingEmail) {
            throw new Error("Email is already registered");
        }
        // Check duplicate username
        const existingUsername = await prisma_1.default.user.findUnique({ where: { username } });
        if (existingUsername) {
            throw new Error("Username is already taken");
        }
        // Check duplicate phone number
        const existingPhone = await prisma_1.default.user.findUnique({
            where: { phoneNumber },
        });
        if (existingPhone) {
            throw new Error("Phone number is already registered");
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // Atomic: create the User and link it to the verified Resident.
        // The UNIQUE constraint on users.resident_id is the database-level
        // guard against double-linking (mapped as P2002 below).
        try {
            const result = await prisma_1.default.$transaction(async (tx) => {
                // Create user with STRICTLY FORCED role = RESIDENT
                const user = await tx.user.create({
                    data: {
                        email,
                        username,
                        fullname,
                        phoneNumber,
                        password: passwordHash,
                        role: "RESIDENT",
                        isVerified: false,
                        resident: { connect: { id: matched.id } },
                    },
                });
                // Create email verification token
                const verifyToken = (0, token_1.generateRandomToken)();
                await tx.token.create({
                    data: {
                        type: client_1.TokenType.EMAIL_VERIFY,
                        token: verifyToken,
                        userId: user.id,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                    },
                });
                return { user, verifyToken };
            });
            return {
                user: toAuthUser(result.user),
                verifyToken: result.verifyToken,
            };
        }
        catch (err) {
            if (err?.code === "P2002") {
                throw new Error("This resident is already registered. You cannot create another account.");
            }
            throw err;
        }
    }
    static async login(dto) {
        const { username, password } = dto;
        if (!username || !password) {
            throw new Error("Username and password are required");
        }
        // Find user by username or email
        const user = await prisma_1.default.user.findFirst({
            where: {
                OR: [{ username }, { email: username.toLowerCase() }],
            },
        });
        if (!user || !user.password) {
            throw new Error("Invalid username or password");
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid username or password");
        }
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
        };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        // Save refresh token to database
        await prisma_1.default.token.create({
            data: {
                type: client_1.TokenType.REFRESH,
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
    static async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        if (!payload) {
            throw new Error("Invalid or expired refresh token");
        }
        const storedToken = await prisma_1.default.token.findUnique({
            where: { token: refreshToken },
        });
        if (!storedToken ||
            storedToken.type !== client_1.TokenType.REFRESH ||
            storedToken.revokedAt ||
            storedToken.consumedAt ||
            storedToken.expiresAt < new Date()) {
            throw new Error("Refresh token revoked or expired");
        }
        const user = await prisma_1.default.user.findUnique({ where: { id: payload.id } });
        if (!user) {
            throw new Error("User not found");
        }
        const newAccessToken = (0, jwt_1.generateAccessToken)({
            id: user.id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
        });
        return {
            accessToken: newAccessToken,
            user: toAuthUser(user),
        };
    }
    static async logout(refreshToken) {
        if (!refreshToken)
            return;
        try {
            await prisma_1.default.token.updateMany({
                where: { token: refreshToken, type: client_1.TokenType.REFRESH },
                data: { revokedAt: new Date() },
            });
        }
        catch {
            // Ignore if token doesn't exist
        }
    }
    static async verifyEmail(tokenString) {
        const tokenRecord = await prisma_1.default.token.findUnique({
            where: { token: tokenString },
        });
        if (!tokenRecord ||
            tokenRecord.type !== client_1.TokenType.EMAIL_VERIFY ||
            tokenRecord.revokedAt ||
            tokenRecord.consumedAt ||
            tokenRecord.expiresAt < new Date()) {
            throw new Error("Invalid or expired email verification token");
        }
        await prisma_1.default.user.update({
            where: { id: tokenRecord.userId },
            data: { isVerified: true },
        });
        await prisma_1.default.token.update({
            where: { id: tokenRecord.id },
            data: { consumedAt: new Date() },
        });
        return true;
    }
    static async forgotPassword(emailInput) {
        const email = emailInput.trim().toLowerCase();
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return { message: "If account exists, password reset instructions have been sent." };
        }
        // I-revoke ang mga lumang hindi pa nagagamit na reset tokens para iwas spam
        await prisma_1.default.token.updateMany({
            where: {
                userId: user.id,
                type: client_1.TokenType.PASSWORD_RESET,
                consumedAt: null,
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            data: { revokedAt: new Date() },
        });
        const resetToken = (0, token_1.generateRandomToken)();
        await prisma_1.default.token.create({
            data: {
                type: client_1.TokenType.PASSWORD_RESET,
                token: resetToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            },
        });
        const clientUrl = (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");
        const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;
        try {
            await (0, mailer_1.sendPasswordResetEmail)(email, resetLink);
        }
        catch (err) {
            // Huwag i-expose ang mail error sa client para iwas user enumeration,
            // pero i-log para makita sa server logs.
            console.error("[forgotPassword] failed to send reset email:", err);
        }
        return {
            message: "If account exists, password reset instructions have been sent.",
            resetToken,
        };
    }
    static async resetPassword(tokenString, newPassword) {
        if (!newPassword || newPassword.length < 8) {
            throw new Error("Password must be at least 8 characters");
        }
        const tokenRecord = await prisma_1.default.token.findUnique({
            where: { token: tokenString },
        });
        if (!tokenRecord ||
            tokenRecord.type !== client_1.TokenType.PASSWORD_RESET ||
            tokenRecord.revokedAt ||
            tokenRecord.consumedAt ||
            tokenRecord.expiresAt < new Date()) {
            throw new Error("Invalid or expired password reset token");
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: { id: tokenRecord.userId },
            data: { password: passwordHash },
        });
        await prisma_1.default.token.update({
            where: { id: tokenRecord.id },
            data: { consumedAt: new Date() },
        });
        // Revoke all refresh tokens for security
        await prisma_1.default.token.updateMany({
            where: { userId: tokenRecord.userId, type: client_1.TokenType.REFRESH },
            data: { revokedAt: new Date() },
        });
        return true;
    }
    static async googleAuth(googleData) {
        const { googleId, email, fullname } = googleData;
        const normalizedEmail = email.toLowerCase().trim();
        let user = await prisma_1.default.user.findFirst({
            where: {
                OR: [{ googleId }, { email: normalizedEmail }],
            },
        });
        if (!user) {
            const baseUsername = normalizedEmail.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
            const username = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
            user = await prisma_1.default.user.create({
                data: {
                    email: normalizedEmail,
                    username,
                    fullname: fullname || baseUsername,
                    googleId,
                    role: "RESIDENT", // NEVER create ADMIN via Google
                    isVerified: true,
                },
            });
        }
        else if (!user.googleId) {
            user = await prisma_1.default.user.update({
                where: { id: user.id },
                data: { googleId, isVerified: true },
            });
        }
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
        };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        await prisma_1.default.token.create({
            data: {
                type: client_1.TokenType.REFRESH,
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
    static async getUserById(id) {
        const user = await prisma_1.default.user.findUnique({ where: { id } });
        if (!user)
            return null;
        return toAuthUser(user);
    }
}
exports.AuthService = AuthService;
