"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidId = isValidId;
exports.isValidEmail = isValidEmail;
exports.isValidName = isValidName;
exports.isValidPassword = isValidPassword;
const zod_1 = require("zod");
function isValidId(id) {
    const rightId = zod_1.z.number().int().positive();
    const testId = rightId.safeParse(id);
    return testId.success;
}
function isValidEmail(email) {
    /**
    *  TODO: Quando a aplicação estiver na fase final, trocar o .max(256) por .email()
    */
    const rightEmail = zod_1.z.string().max(256);
    const testEmail = rightEmail.safeParse(email);
    return testEmail.success;
}
function isValidName(name) {
    const rightName = zod_1.z.string().max(50).refine((name) => /\d/.test(name));
    const testName = rightName.safeParse(name);
    return testName.success;
}
function isValidPassword(password) {
    const rightPassword = zod_1.z.string().min(8).max(20);
    const testPassword = rightPassword.safeParse(password);
    return testPassword.success;
}
