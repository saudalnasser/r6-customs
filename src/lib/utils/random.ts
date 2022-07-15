export function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues: T[keyof T][] = Object.keys(anEnum)
    .map((n) => Number.parseInt(n))
    .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];

  const randomIndex: number = Math.floor(Math.random() * enumValues.length);

  return enumValues[randomIndex];
}
