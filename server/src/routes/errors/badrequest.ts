import RoutingError from "./error";

class BadRequestError extends RoutingError {
    get status(): number {
        return 400;
    }

    get message(): string {
        return "Bad request!";
    }

    toJson() {
        return { message: this.message };
    }
}

export default BadRequestError;
