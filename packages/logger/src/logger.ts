const stringLogger = {
  trace: (...message: unknown[]): void =>
    console.trace(JSON.stringify(message)),
  info: (...message: unknown[]): void => console.info(JSON.stringify(message)),
  debug: (...message: unknown[]): void =>
    console.debug(JSON.stringify(message)),
  warn: (...message: unknown[]): void => console.warn(JSON.stringify(message)),
  error: (...message: unknown[]): void =>
    console.error(JSON.stringify(message)),
};

export const getLogger = (): typeof stringLogger =>
  process.env.NODE_ENV === 'production' ? stringLogger : console;

export const logger = getLogger();
