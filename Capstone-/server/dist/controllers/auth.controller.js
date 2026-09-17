"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async register(req, res) {
        try {
            const result = await auth_service_1.AuthService.register(req.body);
            res.status(201).json({
                success: true,
                message: "User registered successfully. Please verify your email.",
                user: result.user,
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: err.message || "Registration failed",
            });
        }
    }
    static async login(req, res) {
        try {
            const result = await auth_service_1.AuthService.login(req.body);
            // Optionally set refresh token in HTTP-only cookie
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                success: true,
                message: "Login successful",
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            });
        }
        catch (err) {
            res.status(401).json({
                success: false,
                message: err.message || "Invalid credentials",
            });
        }
    }
    static async refresh(req, res) {
        try {
            const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
            const result = await auth_service_1.AuthService.refresh(refreshToken);
            res.status(200).json({
                success: true,
                accessToken: result.accessToken,
                user: result.user,
            });
        }
        catch (err) {
            res.status(401).json({
                success: false,
                message: err.message || "Could not refresh token",
            });
        }
    }
    static async logout(req, res) {
        try {
            const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
            await auth_service_1.AuthService.logout(refreshToken);
            res.clearCookie("refreshToken");
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err.message || "Logout failed",
            });
        }
    }
    static async verifyEmail(req, res) {
        try {
            const token = req.query.token || req.body.token;
            if (!token) {
                return res.status(400).json({ success: false, message: "Token is required" });
            }
            await auth_service_1.AuthService.verifyEmail(token);
            res.status(200).json({
                success: true,
                message: "Email verified successfully",
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: err.message || "Verification failed",
            });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, message: "Email is required" });
            }
            const result = await auth_service_1.AuthService.forgotPassword(email);
            res.status(200).json({
                success: true,
                message: result.message,
            });
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err.message || "Password reset request failed",
            });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            if (!token || !password) {
                return res.status(400).json({ success: false, message: "Token and new password are required" });
            }
            await auth_service_1.AuthService.resetPassword(token, password);
            res.status(200).json({
                success: true,
                message: "Password reset successfully",
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: err.message || "Password reset failed",
            });
        }
    }
    static async googleAuth(req, res) {
        try {
            const { googleId, email, fullname } = req.body;
            if (!googleId || !email) {
                return res.status(400).json({ success: false, message: "Google ID and email are required" });
            }
            const result = await auth_service_1.AuthService.googleAuth({ googleId, email, fullname });
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                success: true,
                message: "Google login successful",
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: err.message || "Google auth failed",
            });
        }
    }
    static async me(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            const user = await auth_service_1.AuthService.getUserById(req.user.id);
            if (!user) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            res.status(200).json({
                success: true,
                user,
            });
        }
        catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}
exports.AuthController = AuthController;
