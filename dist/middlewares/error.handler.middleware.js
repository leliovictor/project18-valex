var AppError = /** @class */ (function () {
    function AppError(statusCode, message, details) {
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
    }
    return AppError;
}());
function errorHandler(error, _req, res, _next) {
    var statusCode = error.statusCode, message = error.message, details = error.details;
    return error.statusCode !== 500
        ? res.status(statusCode).send({ message: message, details: details })
        : res.status(500).send({
            message: "Internal server error",
            details: error
        });
}
export { AppError };
export default errorHandler;
