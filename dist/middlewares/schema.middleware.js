import { AppError } from "./error.handler.middleware.js";
export default function validateSchemaMiddleware(schema) {
    return function (req, res, next) {
        var body = req.body;
        var error = schema.validate(body, { abortEarly: false }).error;
        if (error) {
            throw new AppError(422, "Invalid input", error.details.map(function (e) { return e.message; }).join(", "));
        }
        res.locals.body = req.body;
        next();
    };
}
