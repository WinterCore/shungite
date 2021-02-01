export type BasicErrorResponse = { message: string };

abstract class RoutingError<T = BasicErrorResponse> extends Error {
    abstract get status(): number;
    abstract get message(): string;
    abstract toJson(): T;
}

export default RoutingError;
