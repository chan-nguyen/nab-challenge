import { buildCorrelationIdObject } from './correlationId';

test('buildCorrelationIdObject should return a correct object', () => {
  expect(buildCorrelationIdObject(undefined)).toEqual({
    correlationId: '',
  });

  expect(buildCorrelationIdObject(['some string'])).toEqual({
    correlationId: '',
  });

  expect(
    buildCorrelationIdObject('53a1a018-caee-4c44-8f5c-17ea99afaf3d'),
  ).toEqual({ correlationId: '53a1a018-caee-4c44-8f5c-17ea99afaf3d' });
});
