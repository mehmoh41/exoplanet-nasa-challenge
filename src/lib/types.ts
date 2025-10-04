export type Exoplanet = {
  pl_name: string;
  hostname: string;
  disc_year: number;
  disc_method: string;
  pl_orbper: number | null; // Orbital Period [days]
  pl_rade: number | null; // Planet Radius [Earth radii]
  pl_masse: number | null; // Planet Mass [Earth mass]
  st_teff: number | null; // Stellar Effective Temperature [K]
  st_rad: number | null; // Stellar Radius [Solar radii]
  st_mass: number | null; // Stellar Mass [Solar mass]
};
