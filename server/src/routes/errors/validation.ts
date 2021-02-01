import RoutingError from "./error";

class ValidationError extends RoutingError {
    constructor(errors: string[]) {
        super();
        this._errors = errors;
    }

    get status(): number {
        return 422;
    }

    get message(): string {
        return "The given data was invalid";
    }
}

export default ValidationError;
