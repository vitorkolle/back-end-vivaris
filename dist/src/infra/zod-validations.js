"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validDate = exports.validEmail = exports.validId = void 0;
const zod_1 = require("zod");
exports.validId = zod_1.z.number().int().positive({ message: "" });
exports.validEmail = zod_1.z.string().email({ message: "" });
exports.validDate = zod_1.z.string().date();
