import RoutingError from "./error";

class UnauthorizedError extends RoutingError {
    get status(): number {
        return 403;
    }

    get message(): string {
        return "You're not allowed to be here!";
    }
}

export default UnauthorizedError;
