import type { ParamsObject, Primitive } from "./utility-types";

export const createEntityKey = (entity: string, ...parts: (Primitive | Primitive[])[]) =>
  [entity, ...parts.flat().filter(Boolean)] as const;

export const serializeObjectEntries = (objectSource?: ParamsObject): string[] => {
  return objectSource
    ? Object.entries(objectSource).map(
        ([key, value]) => `${key}:${Array.isArray(value) ? value.join(",") : value}`,
      )
    : [];
};
