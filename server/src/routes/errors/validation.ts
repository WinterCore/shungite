import RoutingError from "./error";

class ValidationError extends RoutingError {
    constructor(errors: string[]) {
        super();
        this._errors = errors;
    }

    get status(): number {
        return 403;
    }

    get message(): string {
        return "You're not allowed to be here!";
    }
}

export default ValidationError;
