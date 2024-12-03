"use strict";
/**
 * Os comentários estão sendo criados com a extensão betterComents para melhorar a legibilidade
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidId = isValidId;
exports.isValidEmail = isValidEmail;
exports.isValidName = isValidName;
exports.isValidPassword = isValidPassword;
exports.isValidWeekDay = isValidWeekDay;
exports.isValidHour = isValidHour;
exports.isValidNumberArray = isValidNumberArray;
exports.isValidAvailbilityStatus = isValidAvailbilityStatus;
exports.isValidAssessment = isValidAssessment;
exports.isValidUser = isValidUser;
exports.isValidMood = isValidMood;
const zod_1 = require("zod");
function isValidId(id) {
    console.log(id);
    const idSchema = zod_1.z.number().int().positive();
    const testId = idSchema.safeParse(id);
    return testId.success;
}
function isValidEmail(email) {
    // TODO: Quando a aplicação estiver na fase final, trocar o .max(256) por .email()
    const emailSchema = zod_1.z.string().max(256);
    const testEmail = emailSchema.safeParse(email);
    return testEmail.success;
}
function isValidName(name) {
    const nameSchema = zod_1.z.string().max(50).refine((name) => /^[A-Za-zÀ-ÖØ-ÿ ]+$/.test(name));
    const testName = nameSchema.safeParse(name);
    return testName.success;
}
function isValidPassword(password) {
    const passwordSchema = zod_1.z.string().min(8).max(20);
    const testPassword = passwordSchema.safeParse(password);
    return testPassword.success;
}
function isValidWeekDay(date) {
    //? Verificar se o tipo 'date' do zod corresponde ao tipo de data que estamos utilizando
    //* ^  Possível uso quando a aplicação estiver na fase final
    const dateSchema = zod_1.z.string().min(5).max(7);
    const testDate = dateSchema.safeParse(date);
    if (!testDate.success) {
        return false;
    }
    const weekDaysArray = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
    const weekDaySchema = zod_1.z.enum(weekDaysArray);
    const finalDayTest = weekDaySchema.safeParse(date);
    return finalDayTest.success;
}
function isValidHour(hour) {
    const hourSchema = zod_1.z.string().length(8);
    const validateHour = hourSchema.safeParse(hour);
    return validateHour.success;
}
function isValidNumberArray(numberArray) {
    const numberArraySchema = zod_1.z.array(zod_1.z.number().int().positive()).min(1);
    const testNumberArray = numberArraySchema.safeParse(numberArray);
    return testNumberArray.success;
}
function isValidAvailbilityStatus(availabilityStatus) {
    const availabilityStatusSchema = zod_1.z.string().min(4).max(11);
    const testStatus = availabilityStatusSchema.safeParse(availabilityStatus);
    if (!testStatus.success) {
        return false;
    }
    const availabilityStatusArray = ['Livre', 'Selecionado', 'Pago', 'Concluido'];
    const availabilityStatusArraySchema = zod_1.z.enum(availabilityStatusArray);
    const finalStatusTest = availabilityStatusArraySchema.safeParse(availabilityStatus);
    return finalStatusTest.success;
}
function isValidAssessment(avaliacao) {
    return __awaiter(this, void 0, void 0, function* () {
        const assessmentSchema = zod_1.z.enum(['Um', 'Dois', 'Tres', 'Quatro', 'Cinco']);
        const testAssessment = assessmentSchema.safeParse(avaliacao);
        return testAssessment.success;
    });
}
function isValidUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const firstUserSchema = zod_1.z.enum(['cliente', 'psicologo']);
        const testUser = firstUserSchema.safeParse(user);
        return testUser.success;
    });
}
function isValidMood(mood) {
    return __awaiter(this, void 0, void 0, function* () {
        const moodArray = ["Muito_triste", "Triste", "Neutro", "Feliz", "Muito_feliz"];
        const moodSchema = zod_1.z.enum(moodArray);
        const testMood = moodSchema.safeParse(mood);
        return testMood.success;
    });
}
