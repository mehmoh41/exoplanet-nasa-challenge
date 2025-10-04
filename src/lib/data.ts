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
        Papa.parse<Exoplanet>(csvFile, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Filter out any rows that are null or don't have a planet name
                const validData = results.data.filter(row => row && row.pl_name);
                resolve(validData);
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
