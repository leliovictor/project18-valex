import joi from "joi";
var rechargeSchema = joi.object({
    cardId: joi.number().integer().greater(0).required(),
    amount: joi.number().integer().greater(0).required()
});
export { rechargeSchema };
