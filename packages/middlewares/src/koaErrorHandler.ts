import { HttpStatus } from './httpStatus';
import { HttpError } from 'http-errors';
import { Context, Next } from 'koa';
import { ZodError } from 'zod';

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

    /**
     * We'd like to return { error } but:
     * - in case of ZodError,
     *     `message` is JSON.stringify(issues) which is not readable
     *     we return the error object which includes issues instead.
     * - in case of DatabaseError,
     *     `message` is not included (why?),
     *     so we want to include it (way more explicit than the object)
     */
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
