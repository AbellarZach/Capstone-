"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "Access token missing or unauthorized" });
    }
    const payload = (0, jwt_1.verifyAccessToken)(token);
    if (!payload) {
        return res.status(401).json({ success: false, message: "Invalid or expired access token" });
    }
    req.user = payload;
    next();
}
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        const userRole = req.user.role.toUpperCase();
        const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());
        if (!normalizedAllowed.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access restricted to ${allowedRoles.join(", ")} roles`,
            });
        }
        next();
    };
}
