export type UnionFromTuple<T extends unknown[]> = T extends (infer U)[] ? U : never;

export type ExtractValueByKey<K extends PropertyKey, U> =
    U extends Record<PropertyKey, unknown> ? (K extends keyof U ? U[K] : never) : never;
