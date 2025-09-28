import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    const where: any = {};
    if (category) where.category = category;
    if (type) where.type = type;

    const studyResources = await db.studyResource.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(studyResources);
  } catch (error) {
    console.error('Error fetching study resources:', error);
    return NextResponse.json({ error: 'Failed to fetch study resources' }, { status: 500 });
  }
}