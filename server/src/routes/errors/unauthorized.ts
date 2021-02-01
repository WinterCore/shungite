import RoutingError from "./error";

class UnauthorizedError extends RoutingError {
    get status(): number {
        return 403;
    }

    get message(): string {
        return "You're not allowed to be here!";
    }

    toJson() {
        return { message: this.message };
    }
}

export default UnauthorizedError;
