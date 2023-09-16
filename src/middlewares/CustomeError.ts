export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface ErrorResponse {
  error: string;
}
