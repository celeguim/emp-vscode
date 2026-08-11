export interface Environment {
  name: string;
  project: string;
  cluster: string;
  targetRevision: string;
  namespace: string;
  syncPolicy?: string;
  file?: string;
}
