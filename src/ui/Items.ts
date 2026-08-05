import { Item } from "./Item";

export function item<T>(
  label: string,
  value: T,
  description?: string,
  detail?: string,
): Item<T> {
  return {
    label,
    value,
    description,
    detail,
  };
}
