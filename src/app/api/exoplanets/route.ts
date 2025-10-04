import { getExoplanets } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { offset = 0, limit = 100 } = await request.json();
    const planets = await getExoplanets({ offset, limit });
    return NextResponse.json(planets);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ message: 'Error fetching exoplanet data' }, { status: 500 });
  }
}
