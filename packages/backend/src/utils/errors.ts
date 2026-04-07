export class AppError extends Error {
    constructor(
        public message: string, //what went wrong
        //add status code and code that base error doesn't have
        public statusCode: number = 500, //status code
        public code: string = 'INTERNAL_ERROR' //short machine readable string
    ) {
        super(message); //use parent error constructor
        this.name = this.constructor.name; //class name where error occurs
        Error.captureStackTrace(this, this.constructor); //use current call stack wo constructor
    }
}

export class ValidationError extends AppError {
    constructor(message: string, public details?: unknown) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
    }
}

export class NotFoundError extends AppError {   
    constructor(message: string = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT');
    }
}