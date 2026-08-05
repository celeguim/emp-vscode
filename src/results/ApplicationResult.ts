export interface GeneratedObject<T = unknown> {
  folder: string;
  name: string;
  object: T;
}

export interface ApplicationResult {
  objects: GeneratedObject[];
}
