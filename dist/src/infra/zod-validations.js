"use strict";
/**
 * Os comentários estão sendo criados com a extensão betterComents para melhorar a legibilidade
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidId = isValidId;
exports.isValidEmail = isValidEmail;
exports.isValidName = isValidName;
exports.isValidPassword = isValidPassword;
exports.isValidWeekDay = isValidWeekDay;
exports.isValidHour = isValidHour;
const zod_1 = require("zod");
function isValidId(id) {
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
    const nameSchema = zod_1.z.string().max(50).refine((name) => /\d/.test(name));
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
    //*^  Possível uso quando a aplicação estiver na fase final
    const dateSchema = zod_1.z.string().min(5).max(7);
    const testDate = dateSchema.safeParse(date);
    if (testDate.success === false) {
        return false;
    }
    const weekDaysArray = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const weekDaySchema = zod_1.z.enum(weekDaysArray);
    const finalDayTest = weekDaySchema.safeParse(date);
    return finalDayTest.success;
}
function isValidHour(hour) {
    const hourSchema = zod_1.z.string().time();
    const validateHour = hourSchema.safeParse(hour);
    console.log(validateHour.error);
    return validateHour.success;
}
