import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const certifications = await db.certification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(certifications);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      issuer,
      acquiredDate,
      expiryDate,
      status,
      progress,
      certificateUrl,
      notes,
      userId
    } = body;

    if (!name || !issuer || !userId) {
      return NextResponse.json(
        { error: 'Name, issuer, and userId are required' },
        { status: 400 }
      );
    }

    const certification = await db.certification.create({
      data: {
        name,
        issuer,
        acquiredDate: acquiredDate ? new Date(acquiredDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status,
        progress: progress || 0,
        certificateUrl,
        notes,
        userId
      }
    });

    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
  }
}