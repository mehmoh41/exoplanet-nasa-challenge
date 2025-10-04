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
                if (results.errors.length) {
                  console.error('CSV Parsing Errors:', results.errors);
                  reject(new Error('Failed to parse CSV file.'));
                  return;
                }
                
                const validData = results.data.filter((row: any) => row && (row.kepler_name || row.kepoi_name));
                
                const mappedData: Exoplanet[] = validData.map((row: any) => ({
                    pl_name: row.kepler_name || row.kepoi_name,
                    hostname: 'N/A',
                    disc_year: 0,
                    disc_method: 'Transit',
                    pl_orbper: row.koi_period,
                    pl_rade: row.koi_prad,
                    pl_masse: null,
                    st_teff: row.koi_steff,
                    st_rad: row.koi_srad,
                    st_mass: null,
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
            error: (error: any) => {
                console.error('Error parsing CSV file:', error);
                reject(error);
            }
        });
    });
  } catch (error) {
    console.error('An unexpected error occurred while reading exoplanet data:', error);
    return [];
  }
}
