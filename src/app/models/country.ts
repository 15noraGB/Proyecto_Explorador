export interface Country {
  name: string;
  code: string;
  alpha3Code: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  languages: string[];
  currency: string;
  flag: string;
  callingCode: string;
  latlng?: [number, number]; // <--- Añadir esto si falta
}