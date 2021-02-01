import RoutingError from "./error";

class UnauthenticatedError extends RoutingError {
    get status(): number {
        return 401;
    }

    get message(): string {
        return "Unauthenticated";
    }

    toJson() {
        return { message: this.message };
    }
}

export default UnauthenticatedError;
