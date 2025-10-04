import type { Exoplanet } from './types';
import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';

// This function now exclusively runs on the server.
export async function getExoplanets(): Promise<Exoplanet[]> {
  try {
    const csvFilePath = path.join(process.cwd(), 'src', 'lib', 'exoplanet.csv');
    const csvFile = fs.readFileSync(csvFilePath, 'utf8');

    return new Promise((resolve, reject) => {
        Papa.parse(csvFile, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Filter out any rows that are null or don't have a planet name
                const validData = results.data.filter((row: any) => row && (row.pl_name || row.kepler_name));
                
                // Map the CSV data to the Exoplanet type
                const mappedData: Exoplanet[] = validData.map((row: any) => ({
                    pl_name: row.kepler_name || row.pl_name,
                    hostname: row.hostname,
                    disc_year: row.disc_year,
                    disc_method: row.discoverymethod || row.disc_method,
                    pl_orbper: row.koi_period || row.pl_orbper,
                    pl_rade: row.koi_prad || row.pl_rade,
                    pl_masse: row.pl_masse,
                    st_teff: row.koi_steff || row.st_teff,
                    st_rad: row.koi_srad || row.st_rad,
                    st_mass: row.st_mass,
                    // Kepler-specific fields for future use
                    koi_disposition: row.koi_disposition,
                    koi_score: row.koi_score,
                    koi_fpflag_nt: row.koi_fpflag_nt,
                    koi_fpflag_ss: row.koi_fpflag_ss,
                    koi_fpflag_co: row.koi_fpflag_co,
                    koi_fpflag_ec: row.koi_fpflag_ec,
                    koi_teq: row.koi_teq,
                }));
                resolve(mappedData);
            },
            error: (error) => {
                console.error('Error parsing CSV file:', error);
                reject([]);
            }
        });
    });
  } catch (error) {
    console.error('An unexpected error occurred while reading exoplanet data:', error);
    return [];
  }
}
