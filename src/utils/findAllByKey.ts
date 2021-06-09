export function findAllByKey(obj: any, keyToFind: string) {
  return (Object.entries(obj) as any).reduce(
    (acc: any, [key, value]: any) =>
      key === keyToFind
        ? acc.concat(value)
        : typeof value === "object"
        ? acc.concat(findAllByKey(value, keyToFind))
        : acc,
    []
  );
}
