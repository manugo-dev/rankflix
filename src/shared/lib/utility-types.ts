export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ParamsObject = Record<string, Primitive | Primitive[]>;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Primitive = string | number | boolean | null | undefined;
