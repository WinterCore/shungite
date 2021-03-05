import RoutingError from "./error";

class UnauthorizedError extends RoutingError {
    private _message: string;

    constructor(message: string = "You're not allowed to perform this action!") {
        super();
        this._message = message;
    }

    get status(): number {
        return 403;
    }

    get message(): string {
        return this._message;
    }

    toJson() {
        return { message: this.message };
    }
}

export default UnauthorizedError;
