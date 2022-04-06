import { buildSearchQuery } from './queryBuilder';

test('buildSearchQuery should return a correct db search string', () => {
  expect(buildSearchQuery([], 'shoes')).toEqual('');

  expect(buildSearchQuery(['name', 'description'], 'shoes')).toEqual(
    "name ILIKE '%shoes%' OR description ILIKE '%shoes%'",
  );
});
