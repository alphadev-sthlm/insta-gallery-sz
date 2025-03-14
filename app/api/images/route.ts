import { NextResponse } from 'next/server';
import { ImageResponse } from '@/app/types/image';

export async function GET() {
  try {
    const response = await fetch(
      'https://wkuhfuofhpjuwilhhtnj.supabase.co/functions/v1/list-images',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ImageResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
} 