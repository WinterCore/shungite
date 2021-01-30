import RoutingError from "./error";

class NotFoundError extends RoutingError {
    get status(): number {
        return 404;
    }

    get message(): string {
        return "We couldn't find what you're looking for!";
    }
}

export default NotFoundError;
