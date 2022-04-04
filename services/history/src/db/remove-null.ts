type BaseElement =
  | string
  | number
  | Date
  | null
  | undefined
  | Record<string, unknown>;

type ArrElement = Array<ArrElement | BaseElement>;

type Obj = BaseElement | ArrElement;

export const removeNull = (obj: Obj): Obj => {
  if (typeof obj === 'string' || typeof obj === 'number' || obj instanceof Date)
    return obj;

  if (obj === null || obj === undefined) return undefined;

  if (Array.isArray(obj)) return obj.map(removeNull);

  return Object.keys(obj)
    .filter(function (k) {
      return obj[k] != null;
    })
    .reduce<Record<string, unknown>>(function (acc, k) {
      acc[k] = typeof obj[k] === 'object' ? removeNull(obj[k] as Obj) : obj[k];
      return acc;
    }, {});
};
