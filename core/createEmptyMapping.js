import { mappingSchema } from "./mappingSchema";

export function createEmptyMapping() {
  return JSON.parse(JSON.stringify(mappingSchema));
}
