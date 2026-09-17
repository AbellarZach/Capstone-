"use strict";
// Exact resident-matching normalizers (Signup -> Residents verification).
// No fuzzy matching: normalized equality only. Username, password and
// address are never used for matching.
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeFullName = normalizeFullName;
exports.normalizeEmail = normalizeEmail;
exports.normalizePhone = normalizePhone;
function normalizeFullName(value) {
    return (String(value ?? "")
        .trim()
        // Collapse tabs/newlines/multiple spaces into a single space.
        .replace(/\s+/g, " ")
        .toLowerCase());
}
function normalizeEmail(value) {
    return String(value ?? "").trim().toLowerCase();
}
// Canonical Philippine mobile format: 639XXXXXXXXX (12 digits).
// Accepts 09171234567, 0917-123-4567, 0917 123 4567, +639171234567,
// 639171234567, 9171234567. Returns "" when no usable digits remain.
function normalizePhone(value) {
    const digits = String(value ?? "").replace(/\D/g, "");
    if (!digits)
        return "";
    // International format with country code.
    if (digits.startsWith("63")) {
        const national = digits.slice(2).replace(/^0+/, "");
        if (!national)
            return "";
        return `63${national}`;
    }
    // Domestic formats: strip leading trunk zeros, prefix country code.
    const national = digits.replace(/^0+/, "");
    if (!national)
        return "";
    if (national.startsWith("63") && national.length > 10)
        return national;
    return `63${national}`;
}
