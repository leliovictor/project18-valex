import joi from "joi";

const paymentSchema = joi.object({
    cardId: joi.number().integer().greater(0).required(),
    password: joi.string().length(4).pattern(/^[0-9]{4}$/).required(),
    businessId: joi.number().integer().greater(0).required(),
    amount: joi.number().integer().greater(0).required(),
  });
  
  export { paymentSchema };