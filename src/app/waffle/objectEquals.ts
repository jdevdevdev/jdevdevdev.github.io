export const objectEquals = <T extends object>(obj1: T, obj2: T): boolean => {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
      if (!objectEquals(val1, val2)) return false;
    } else if (val1 !== val2) {
      return false;
    }
  }

  return true;
}