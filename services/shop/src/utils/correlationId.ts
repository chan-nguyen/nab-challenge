export const buildCorrelationIdObject = (
  correlationId: string | string[] | undefined,
): { correlationId: string } => ({
  correlationId: typeof correlationId === 'string' ? correlationId : '',
});
