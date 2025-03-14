import { NextResponse } from 'next/server';
import { ImageResponse } from '@/app/types/image';

export async function GET(request: Request) {
  try {
    // Get page from query parameters
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Add page parameter to the API URL
    const apiUrl = new URL('https://wkuhfuofhpjuwilhhtnj.supabase.co/functions/v1/list-images');
    apiUrl.searchParams.set('page', page.toString());
    apiUrl.searchParams.set('limit', limit.toString());

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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