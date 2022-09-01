import { NextFunction, Response, Request } from 'express';
import { ObjectSchema } from 'joi';

import { AppError } from './error.handler.middleware.js';

export default function validateSchemaMiddleware(schema: ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const { error } = schema.validate(body, { abortEarly: false });

    if (error) {
      throw new AppError(
        'Invalid input',
          422,
        'Invalid input',
        error.details.map((e) => e.message).join(', ')
      )
    }

    res.locals.body = req.body;

    next();
  };
}
