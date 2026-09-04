export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = "INTERNAL_ERROR",
    statusCode: number = 500,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, context);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", context?: Record<string, unknown>) {
    super(message, "NOT_FOUND", 404, context);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized. Please sign in.", context?: Record<string, unknown>) {
    super(message, "UNAUTHORIZED", 401, context);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden. Admin access required.", context?: Record<string, unknown>) {
    super(message, "FORBIDDEN", 403, context);
  }
}

export class UploadError extends AppError {
  constructor(message: string = "Image upload failed", context?: Record<string, unknown>) {
    super(message, "UPLOAD_ERROR", 500, context);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed", context?: Record<string, unknown>) {
    super(message, "DATABASE_ERROR", 500, context);
  }
}
