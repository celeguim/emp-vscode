import { Catalog } from "../catalog/Catalog";
import { UI } from "../ui/UI";

export interface Context {
  catalog: Catalog;
  ui: UI;
}
