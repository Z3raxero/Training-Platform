import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const examResults = await db.examResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(examResults);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    return NextResponse.json({ error: 'Failed to fetch exam results' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      examName,
      score,
      maxScore,
      percentage,
      passed,
      examDate,
      fileUrl,
      fileName,
      fileType,
      fileSize,
      notes,
      userId
    } = body;

    if (!title || !examName || !userId) {
      return NextResponse.json(
        { error: 'Title, examName, and userId are required' },
        { status: 400 }
      );
    }

    const examResult = await db.examResult.create({
      data: {
        title,
        examName,
        score,
        maxScore,
        percentage,
        passed,
        examDate: examDate ? new Date(examDate) : null,
        fileUrl,
        fileName,
        fileType,
        fileSize,
        notes,
        userId
      }
    });

    return NextResponse.json(examResult, { status: 201 });
  } catch (error) {
    console.error('Error creating exam result:', error);
    return NextResponse.json({ error: 'Failed to create exam result' }, { status: 500 });
  }
}