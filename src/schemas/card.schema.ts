import joi from "joi";

const cardSchema = joi.object({
  employeeId: joi.number().integer().greater(0).required(),
  type: joi
    .string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

const cardActivationSchema = joi.object({
  id: joi.number().integer().greater(0).required(),
  CVC: joi.string().length(3).pattern(/^[0-9]{3}$/).required(), 
  password: joi.string().length(4).pattern(/^[0-9]{4}$/).required(),
});

const cardBlockSchema = joi.object({
  id: joi.number().integer().greater(0).required(),
  password: joi.string().length(4).pattern(/^[0-9]{4}$/).required(),
});

export { cardSchema, cardActivationSchema, cardBlockSchema };
