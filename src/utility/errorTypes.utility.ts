// NOTE: This is for more legibility of code.

/**
 * Creates a custom error class with a specified name
 *
 * @param {string} errorName - The name to assign to the custom error
 * @returns {class} A class that extending Error with a "cause" property
 *
 * Usage => throw new AuthError("error message", {cause})
 *
 * Validation => if (error instanceof AuthError) { // code for error }
 *
 * Where "error" should be the throwed error on a try/catch, and "AuthError" is the error type when something goes wrong with an authentication.
 * It's same for others error types
 */
const createErrorFactory = function (errorName: string) {
  return class CustomError<T> extends Error {
    constructor(message: string, cause: T) {
      super(message);
      this.name = errorName;
      this.cause = cause;
      this.stack = "";
    }
  };
};

export const AuthError = createErrorFactory("AuthError");
export const BadRequestError = createErrorFactory("BadRequestError");
export const ConnectionError = createErrorFactory("ConnectionError");
export const ForbidenError = createErrorFactory("ForbidenError");
export const NotFoundError = createErrorFactory("NotFoundError");
export const MethodNotAllowed = createErrorFactory("MethodNotAllowed");
export const ServerError = createErrorFactory("ServerError");

export const ValidationError = createErrorFactory("ValidationError");
