export class RefreshTokenNotFoundError extends Error {
    constructor(msg?: string) {
        super(msg);
        this.name = "RefreshTokenUnfoundError"

        Object.setPrototypeOf(this, RefreshTokenNotFoundError.prototype);
    }
}