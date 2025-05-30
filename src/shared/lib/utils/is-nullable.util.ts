export const isNullable = (value: unknown): value is null | undefined => value === undefined || value === null;
