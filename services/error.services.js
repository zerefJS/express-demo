export class ApiError extends Error {
    constructor(message, statusCode, db = undefined) {
        super(message);
        this.statusCode = statusCode || 400;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
        db?.release?.()
    }
}