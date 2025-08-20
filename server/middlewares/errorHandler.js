function errorHandler(err, req, res, next) {
    let status = 500;
    let message = "Internal Server Error";

    if (err.name === "Login Error") {
        status = 401;
        message = "Invalid email/password";
    } else if (err.name === "Unauthorized") {
        status = 401;
        message = "Please login first";
    } else if (err.name === "Forbidden") {
        status = 403;
        message = "You are not authorized to perform this action";
    } else if (err.name === "Unauthenticated") {
        status = 401;
        message = "Invalid token";
    } else if (err.name === "Login Input Error") {
        status = 400;
        message = "Email/password is required";
    } else if (
        err.name === "SequelizeValidationError" ||
        err.name === "SequelizeUniqueConstraintError"
    ) {
        status = 400;
        message = err.errors.map((e) => e.message).join(", ");
    }

    res.status(status).json({ message });
}

module.exports = errorHandler;