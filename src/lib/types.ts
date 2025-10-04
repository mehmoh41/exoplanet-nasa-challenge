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
  // Kepler-specific fields
  koi_disposition?: 'CONFIRMED' | 'CANDIDATE' | 'FALSE POSITIVE';
  koi_score?: number | null; // A score (0-1) indicating confidence in the candidate
  koi_fpflag_nt?: number; // Not Transit-Like Flag
  koi_fpflag_ss?: number; // Stellar Variability Flag
  koi_fpflag_co?: number; // Centroid Offset Flag
  koi_fpflag_ec?: number; // Ephemeris Match Indicates Contamination Flag
  koi_teq?: number | null; // Equilibrium Temperature [K]
};
