import joi from "joi";

const insertCredit = joi.object({
  cardId: joi.number().integer().positive().required(),
  amount: joi.number().integer().greater(0).required(),
})

export { insertCredit };
