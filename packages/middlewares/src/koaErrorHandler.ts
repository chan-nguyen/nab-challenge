import { HttpError } from 'http-errors';
import { Context, Next } from 'koa';
import { ZodError } from 'zod';
import { HttpStatus } from './httpStatus';

function isZodError(error: unknown): error is ZodError {
  return error instanceof Error && error.name === 'ZodError';
}

function isHttpError(error: unknown): error is HttpError {
  return error instanceof Error && 'status' in error && 'statusCode' in error;
}

export const koaErrorHandlerMiddleware = async (
  ctx: Context,
  next: Next,
): Promise<void> => {
  try {
    await next();
  } catch (error) {
    ctx.status = isHttpError(error)
      ? error.statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;

    ctx.body = {
      error: {
        ...(error as Error),
        message: isZodError(error)
          ? 'Validation Error'
          : (error as Error).message,
      },
    };

    // Emit the error to the Koa error handler
    ctx.app.emit('error', error, ctx);
  }
};
