/**
 * Modelo de datos de BioNexo.
 * Esta capa tipada está pensada para mapear 1:1 con una futura API / CMS:
 * cada interfaz equivale a una colección (articles, categories, experiments,
 * datasets, publications, authors).
 */

export type Tier =
  | "Investigación publicada"
  | "Interpretación BioNexo"
  | "Divulgación científica";

export type CategorySlug =
  | "biologia"
  | "bioinformatica"
  | "biotecnologia"
  | "ia-cientifica"
  | "investigacion"
  | "ecologia"
  | "ciencia-datos"
  | "tecnologia";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  tint: "primary" | "bio" | "aqua";
}

export interface Author {
  id: string;
  name: string;
  role: string;
  area: string;
  initials: string;
}

export type BlockType =
  | "h2"
  | "p"
  | "list"
  | "quote"
  | "image"
  | "table"
  | "sequence"
  | "note";

export interface BodyBlock {
  type: BlockType;
  text?: string;
  items?: string[];
  src?: string;
  caption?: string;
  header?: string[];
  rows?: string[][];
  label?: string;
}

export interface ArticleSource {
  journal: string;
  year: number;
  doi: string;
  url: string;
  license: string;
  type: string;
}

export interface Reference {
  text: string;
  url?: string;
}

export interface Article {
  slug: string;
  title: string;
  category: CategorySlug;
  excerpt: string;
  date: string; // ISO
  readMin: number;
  authorId: string;
  image: string;
  imageCaption: string;
  tags: string[];
  tier: Tier;
  featured?: boolean;
  source: ArticleSource;
  body: BodyBlock[];
  references: Reference[];
}

export type ExperimentLevel =
  | "Educativo"
  | "Supervisado"
  | "Protocolo de investigación";

export interface Experiment {
  id: string;
  title: string;
  level: ExperimentLevel;
  area: string;
  duration: string;
  difficulty: "Baja" | "Media" | "Alta";
  objective: string;
  materials: string[];
  procedure: string[];
  results: string;
  observations: string;
  explanation: string;
  safety: string[];
  references: Reference[];
}

export interface Dataset {
  id: string;
  name: string;
  org: string;
  kind: string;
  records: string;
  formats: string[];
  license: string;
  url?: string;
  demo?: boolean;
  description: string;
  spark: number[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  area: string;
  doi: string;
  question: string;
  methodology: string;
  results: string;
  conclusion: string;
  references: number;
}

export interface ChartPoint {
  label: string;
  value: number;
  display: string;
}
