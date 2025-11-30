import periodicTableData from '../json/PeriodicTable.json';

export interface PeriodicTable {
  elements: PeriodicElement[];
}

export interface PeriodicElement {
  name: string;
  appearance: string | null;
  atomic_mass: number;
  boil: number | null;
  category: string;
  density: number | null;
  discovered_by: string | null;
  melt: number | null;
  molar_heat: number | null;
  named_by: string | null;
  number: number;
  period: number;
  group: number | null;
  phase: string;
  source: string;
  bohr_model_image: string | null;
  bohr_model_3d: string | null;
  spectral_img: string | null;
  summary: string;
  symbol: string;
  xpos: number;
  ypos: number;
  wxpos: number | null;
  wypos: number | null;
  shells: number[];
  electron_configuration: string;
  electron_configuration_semantic: string;
  electron_affinity: number | null;
  electronegativity_pauling: number | null;
  ionization_energies: number[];
  "cpk-hex": string | null;
  image: Image | null;
  block: string;
}

export interface Image {
  title: string;
  url: string;
  attribution: string;
}

export interface SimpleElement {
  name: string;
  symbol: string;
  atomic_mass: number;
  number: number; // atomic number
  period: number;
  group: number | "unknown";
}


export const periodicTable: PeriodicTable = periodicTableData;

export const simpleElements: SimpleElement[] = periodicTable.elements.map(el => ({
  name: el.name,
  symbol: el.symbol,
  atomic_mass: el.atomic_mass,
  number: el.number,
  period: el.period,
  group: el.group !== null ? el.group : "unknown",
}));
