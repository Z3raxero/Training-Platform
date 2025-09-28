import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const trainingPlans = await db.trainingPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(trainingPlans);
  } catch (error) {
    console.error('Error fetching training plans:', error);
    return NextResponse.json({ error: 'Failed to fetch training plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      targetCertification,
      currentSkillLevel,
      studyHoursPerWeek,
      targetDate,
      userId,
      generateAIPlan
    } = body;

    if (!targetCertification || !currentSkillLevel || !studyHoursPerWeek || !userId) {
      return NextResponse.json(
        { error: 'Target certification, skill level, study hours, and userId are required' },
        { status: 400 }
      );
    }

    let generatedPlan = '';

    if (generateAIPlan) {
      try {
        const zai = await ZAI.create();
        
        const prompt = `Create a comprehensive training plan for a ${currentSkillLevel} level student preparing for ${targetCertification}. 
        The student can study ${studyHoursPerWeek} hours per week.
        ${targetDate ? `They need to complete this by ${new Date(targetDate).toLocaleDateString()}.` : ''}
        
        Please provide a detailed study plan including:
        1. Weekly breakdown of topics
        2. Key concepts to focus on
        3. Practice recommendations
        4. Study resources and materials
        5. Timeline and milestones
        6. Practice exam strategy
        
        Format the response as a structured plan with clear sections and actionable steps.`;

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an expert certification training advisor. Create comprehensive, practical study plans tailored to the individual\'s skill level and time constraints.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        });

        generatedPlan = completion.choices[0]?.message?.content || '';
      } catch (error) {
        console.error('Error generating AI plan:', error);
        generatedPlan = 'Failed to generate AI plan. Please try again.';
      }
    }

    const trainingPlan = await db.trainingPlan.create({
      data: {
        title: title || `${targetCertification} Training Plan`,
        targetCertification,
        currentSkillLevel,
        studyHoursPerWeek,
        targetDate: targetDate ? new Date(targetDate) : null,
        generatedPlan,
        userId
      }
    });

    return NextResponse.json(trainingPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating training plan:', error);
    return NextResponse.json({ error: 'Failed to create training plan' }, { status: 500 });
  }
}