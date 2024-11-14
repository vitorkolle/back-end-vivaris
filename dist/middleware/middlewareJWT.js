"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJWT = createJWT;
exports.getRole = getRole;
exports.validateJWT = validateJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = 'abc123';
const EXPIRES = 60;
function createJWT(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ userId: payload.id, role: payload.role }, secret, { expiresIn: EXPIRES });
        if (!token) {
            return false;
        }
        return token;
    });
}
function getRole(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const verify = jsonwebtoken_1.default.verify(token, secret);
        if (!verify) {
            return 'Função Inválida';
        }
        return verify.role;
    });
}
function validateJWT(token, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const verify = jsonwebtoken_1.default.verify(token, secret);
        if (verify.role !== user) {
            return false;
        }
        return verify ? true : false;
    });
}
