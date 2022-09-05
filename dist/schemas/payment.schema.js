import joi from "joi";
var paymentSchema = joi.object({
    cardId: joi.number().integer().greater(0).required(),
    password: joi
        .string()
        .length(4)
        .pattern(/^[0-9]{4}$/)
        .required(),
    businessId: joi.number().integer().greater(0).required(),
    amount: joi.number().integer().greater(0).required()
});
var onlinePaymentSchema = joi.object({
    number: joi.string().pattern(/^[0-9]*$/).required(),
    cardholderName: joi.string().pattern(/^[A-Z\s]*$/).required(),
    expirationDate: joi.string().pattern(/^[0-9]{2}\/[0-9]{4}$/).length(7).required(),
    CVC: joi
        .string()
        .length(3)
        .pattern(/^[0-9]{3}$/)
        .required(),
    businessId: joi.number().integer().greater(0).required(),
    amount: joi.number().integer().greater(0).required()
});
export { paymentSchema, onlinePaymentSchema };
