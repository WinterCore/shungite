import RoutingError, { BasicErrorResponse } from "./error";

export type ValidationErrorsObj = {
    [key: string]: string[];
};

export type ValidationErrorResponse = BasicErrorResponse & {
    errors: ValidationErrorsObj;
};

class ValidationError extends RoutingError<ValidationErrorResponse> {
    private _errors: ValidationErrorsObj;

    constructor(errors: ValidationErrorsObj) {
        super();
        this._errors = errors;
    }

    get status(): number {
        return 422;
    }

    get message(): string {
        return "The given data was invalid";
    }

    toJson() {
        return {
            message : this.message,
            errors  : this._errors,
        };
    }
}

export default ValidationError;
