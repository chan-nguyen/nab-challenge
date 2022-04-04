import { removeNull } from './remove-null';

test('removeEmpty should remove keys with null values', () => {
  expect(removeNull({ a: 123, b: null })).toEqual({ a: 123 });

  expect(removeNull({ a: 123, b: null, c: { d: 'xyw', e: null } })).toEqual({
    a: 123,
    c: { d: 'xyw' },
  });
});

test('removeEmpty should remove keys with null values in array of object', () => {
  expect(removeNull({ a: 123, b: null, c: [{ d: 'xyz', e: null }] })).toEqual({
    a: 123,
    c: [{ d: 'xyz' }],
  });
});

test('removeEmpty should not remove string in array of strings', () => {
  expect(removeNull({ a: 123, b: null, c: ['xyz'] })).toEqual({
    a: 123,
    c: ['xyz'],
  });
});

test('removeEmpty should keep string, number of date fields', () => {
  const dt = new Date();
  expect(removeNull({ a: 123, b: '', c: dt, d: null })).toEqual({
    a: 123,
    b: '',
    c: dt,
  });
});

test('removeEmpty should change null to undefined in array fields', () => {
  expect(removeNull({ a: 123, b: null, c: ['xyz', null, ''] })).toEqual({
    a: 123,
    c: ['xyz', undefined, ''],
  });
});
