abstract class RoutingError extends Error {
    protected _errors: string[] = [];

    abstract get status(): number;
    abstract get message(): string;

    get errors(): string[] {
        return this._errors;
    }
}

export default RoutingError;
