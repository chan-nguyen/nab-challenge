export const buildSearchQuery = (
  searchFields: string[],
  searchString: string,
): string =>
  searchFields
    .map((field) => `${field} ILIKE '%${searchString}%'`)
    .join(' OR ');
