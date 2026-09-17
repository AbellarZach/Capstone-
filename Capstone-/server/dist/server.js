"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const complaintRoutes = require("../routes/complaintRoutes");
const clientRoutes = require("../routes/clientRoutes");
const hearingRoutes = require("../routes/hearingRoutes");
const summonRoutes = require("../routes/summonRoutes");
const reportRoutes = require("../routes/reportRoutes");
const residentRoutes = require("../routes/residentRoutes");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "12mb" }));
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app.get("/", (_req, res) => {
    res.json({ message: "Barangay EasyReport API Running (TypeScript)" });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin/complaints", complaintRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/hearings", hearingRoutes);
app.use("/api/summons", summonRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/residents", residentRoutes);
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Internal server error" });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
