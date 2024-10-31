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
exports.isValidNumberArray = isValidNumberArray;
exports.isValidAvailbilityStatus = isValidAvailbilityStatus;
exports.isValidCardNumber = isValidCardNumber;
exports.isValidModality = isValidModality;
exports.isValidCvc = isValidCvc;
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
    if (testDate.success === false) {
        return false;
    }
    const weekDaysArray = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
    const weekDaySchema = zod_1.z.enum(weekDaysArray);
    const finalDayTest = weekDaySchema.safeParse(date);
    return finalDayTest.success;
}
function isValidHour(hour) {
    const hourSchema = zod_1.z.string().time().length(8);
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
function isValidCardNumber(cardNumber) {
    const cardNumberSchema = zod_1.z.number().int().positive().min(1111111111111111).max(9999999999999999);
    const testNumber = cardNumberSchema.safeParse(cardNumber);
    return testNumber.success;
}
function isValidModality(modality) {
    const modalitySchema = zod_1.z.enum(['Credito', 'Debito']);
    const testModality = modalitySchema.safeParse(modality);
    return testModality.success;
}
function isValidCvc(cvc) {
    const cvcSchema = zod_1.z.number().int().positive().min(111).max(9999);
    const testCvc = cvcSchema.safeParse(cvc);
    return testCvc.success;
}
