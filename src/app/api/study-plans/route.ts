import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const studyPlans = await db.studyPlan.findMany({
      where: { userId },
      include: {
        studyTasks: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(studyPlans);
  } catch (error) {
    console.error('Error fetching study plans:', error);
    return NextResponse.json({ error: 'Failed to fetch study plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      targetDate,
      totalDays,
      notes,
      userId,
      studyTasks
    } = body;

    if (!title || !totalDays || !userId) {
      return NextResponse.json(
        { error: 'Title, totalDays, and userId are required' },
        { status: 400 }
      );
    }

    const studyPlan = await db.studyPlan.create({
      data: {
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        totalDays,
        notes,
        userId,
        studyTasks: studyTasks ? {
          create: studyTasks.map((task: any, index: number) => ({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            order: index
          }))
        } : undefined
      },
      include: {
        studyTasks: true
      }
    });

    return NextResponse.json(studyPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating study plan:', error);
    return NextResponse.json({ error: 'Failed to create study plan' }, { status: 500 });
  }
}