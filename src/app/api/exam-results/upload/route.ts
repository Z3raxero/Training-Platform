import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const title = formData.get('title') as string;
    const examName = formData.get('examName') as string;
    const score = formData.get('score') ? parseInt(formData.get('score') as string) : null;
    const maxScore = formData.get('maxScore') ? parseInt(formData.get('maxScore') as string) : null;
    const passed = formData.get('passed') ? formData.get('passed') === 'true' : null;
    const examDate = formData.get('examDate') as string;
    const notes = formData.get('notes') as string;
    const userId = formData.get('userId') as string;
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!title || !examName || !userId) {
      return NextResponse.json(
        { error: 'Title, examName, and userId are required' },
        { status: 400 }
      );
    }

    let fileUrl = null;
    let fileName = null;
    let fileType = null;
    let fileSize = null;

    // Handle file upload if present
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'uploads');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const storedFileName = `${timestamp}-${randomId}.${fileExtension}`;
      const filePath = join(uploadsDir, storedFileName);

      // Write file to disk
      await writeFile(filePath, buffer);

      fileUrl = `/uploads/${storedFileName}`;
      fileName = file.name;
      fileType = file.type;
      fileSize = file.size;
    }

    // Calculate percentage if score and maxScore are provided
    let percentage = null;
    if (score !== null && maxScore !== null && maxScore > 0) {
      percentage = Math.round((score / maxScore) * 100 * 100) / 100; // Round to 2 decimal places
    }

    // Create exam result record
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
    console.error('Error creating exam result with upload:', error);
    return NextResponse.json({ error: 'Failed to create exam result' }, { status: 500 });
  }
}