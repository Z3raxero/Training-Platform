import { db } from './db';

async function main() {
  // Create a demo user
  const user = await db.user.create({
    data: {
      id: 'demo-user-1',
      email: 'demo@example.com',
      name: 'Demo User'
    }
  });

  // Create sample certifications
  await db.certification.createMany({
    data: [
      {
        id: 'cert-1',
        name: 'Microsoft Power Platform PL-500',
        issuer: 'Microsoft',
        status: 'IN_PROGRESS',
        progress: 65,
        notes: 'Currently studying for this certification. Focus on Power Apps and Power Automate.',
        userId: user.id
      },
      {
        id: 'cert-2',
        name: 'Microsoft Azure Fundamentals AZ-900',
        issuer: 'Microsoft',
        status: 'ACTIVE',
        progress: 100,
        acquiredDate: new Date('2023-11-20'),
        expiryDate: new Date('2025-11-20'),
        notes: 'Completed successfully. Good foundation for Azure services.',
        userId: user.id
      },
      {
        id: 'cert-3',
        name: 'Microsoft Power BI Data Analyst DA-100',
        issuer: 'Microsoft',
        status: 'NOT_STARTED',
        progress: 0,
        notes: 'Planning to start this certification after PL-500.',
        userId: user.id
      }
    ]
  });

  // Create sample study plans
  const studyPlan1 = await db.studyPlan.create({
    data: {
      id: 'study-plan-1',
      title: 'PL-500 Complete Study Plan',
      description: 'Comprehensive study plan for Microsoft Power Platform PL-500 certification',
      progress: 65,
      targetDate: new Date('2024-06-01'),
      totalDays: 60,
      notes: 'Focus on practical implementation and real-world scenarios',
      userId: user.id
    }
  });

  // Create study tasks for PL-500 plan
  await db.studyTask.createMany({
    data: [
      {
        id: 'task-1',
        title: 'Understand Power Platform architecture',
        description: 'Learn the components of Power Platform and how they work together',
        studyPlanId: studyPlan1.id,
        order: 0
      },
      {
        id: 'task-2',
        title: 'Master Power Apps canvas apps',
        description: 'Build canvas apps, understand controls, formulas, and data integration',
        studyPlanId: studyPlan1.id,
        order: 1
      },
      {
        id: 'task-3',
        title: 'Learn Power Apps model-driven apps',
        description: 'Understand Dataverse, model-driven app design, and business process flows',
        studyPlanId: studyPlan1.id,
        order: 2
      },
      {
        id: 'task-4',
        title: 'Power Automate workflows',
        description: 'Create automated workflows, connectors, and business process automation',
        studyPlanId: studyPlan1.id,
        order: 3
      },
      {
        id: 'task-5',
        title: 'Power Virtual Agents and AI Builder',
        description: 'Build chatbots and implement AI capabilities',
        studyPlanId: studyPlan1.id,
        order: 4
      }
    ]
  });

  const studyPlan2 = await db.studyPlan.create({
    data: {
      id: 'study-plan-2',
      title: 'Azure Fundamentals Refresher',
      description: 'Quick refresher course for AZ-900 concepts',
      progress: 100,
      targetDate: new Date('2024-02-01'),
      totalDays: 14,
      notes: 'Maintaining knowledge of Azure core services',
      userId: user.id
    }
  });

  // Create sample exam results
  await db.examResult.createMany({
    data: [
      {
        id: 'exam-1',
        title: 'AZ-900 Practice Test 1',
        examName: 'Microsoft Azure Fundamentals',
        score: 840,
        maxScore: 1000,
        percentage: 84.0,
        passed: true,
        examDate: new Date('2023-11-15'),
        notes: 'Good score, ready for the real exam',
        userId: user.id
      },
      {
        id: 'exam-2',
        title: 'PL-500 Practice Assessment',
        examName: 'Power Platform Developer',
        score: 720,
        maxScore: 1000,
        percentage: 72.0,
        passed: false,
        examDate: new Date('2024-01-10'),
        notes: 'Need more practice with Power Automate',
        userId: user.id
      }
    ]
  });

  // Create sample training plan
  await db.trainingPlan.create({
    data: {
      id: 'training-plan-1',
      title: 'PL-500 AI Training Plan',
      targetCertification: 'Microsoft Power Platform PL-500',
      currentSkillLevel: 'Intermediate',
      studyHoursPerWeek: 15,
      targetDate: new Date('2024-06-01'),
      generatedPlan: `# PL-500 Study Plan - Intermediate Level

## Week 1-2: Foundation and Architecture
- **Focus**: Power Platform components and architecture
- **Topics**: 
  - Power Platform overview (Power Apps, Power Automate, Power BI, Power Virtual Agents)
  - Common Data Service/Dataverse fundamentals
  - Security and governance
  - Integration capabilities
- **Study Time**: 15 hours/week
- **Activities**: 
  - Complete Microsoft Learn modules
  - Build simple canvas apps
  - Practice with basic Power Automate flows

## Week 3-4: Canvas Apps Deep Dive
- **Focus**: Advanced canvas app development
- **Topics**:
  - Advanced controls and formulas
  - Data integration and sources
  - Custom connectors
  - App design best practices
- **Study Time**: 15 hours/week
- **Activities**:
  - Build complex canvas apps
  - Implement custom business logic
  - Practice with various data sources

## Week 5-6: Model-Driven Apps and Business Process Flows
- **Focus**: Model-driven apps and process automation
- **Topics**:
  - Dataverse data model design
  - Model-driven app creation
  - Business process flows
  - Security roles and sharing
- **Study Time**: 15 hours/week
- **Activities**:
  - Design and build model-driven apps
  - Create business process flows
  - Implement security models

## Week 7-8: Power Automate and Advanced Topics
- **Focus**: Advanced automation and integration
- **Topics**:
  - Advanced Power Automate flows
  - AI Builder and Virtual Agents
  - Custom API integrations
  - Performance optimization
- **Study Time**: 15 hours/week
- **Activities**:
  - Build complex automated workflows
  - Implement AI capabilities
  - Practice exam questions
  - Review and reinforce

## Final Week: Exam Preparation
- **Focus**: Exam readiness and practice
- **Activities**:
  - Take multiple practice exams
  - Review weak areas
  - Hands-on practice with scenarios
  - Final exam preparation

## Key Resources:
- Microsoft Learn PL-500 Learning Path
- Official Microsoft Documentation
- Practice exams and assessments
- Community forums and study groups`,
      isActive: true,
      userId: user.id
    }
  });

  // Create sample study resources
  await db.studyResource.createMany({
    data: [
      {
        id: 'resource-1',
        title: 'Microsoft Learn: Power Platform PL-500',
        description: 'Official Microsoft learning path for PL-500 certification',
        type: 'TUTORIAL',
        url: 'https://docs.microsoft.com/learn/paths/power-platform-developer',
        category: 'Official Documentation',
        difficulty: 'Intermediate',
        estimatedTime: 40
      },
      {
        id: 'resource-2',
        title: 'Power Apps Sample Project: Employee Management System',
        description: 'Build a complete employee management system using Power Apps and Power Automate',
        type: 'PROJECT',
        content: 'Create a canvas app for employee onboarding, including form submissions, approvals, and notifications.',
        category: 'Sample Project',
        difficulty: 'Intermediate',
        estimatedTime: 8
      },
      {
        id: 'resource-3',
        title: 'Power Automate: Approval Workflow Tutorial',
        description: 'Learn to create multi-stage approval workflows',
        type: 'TUTORIAL',
        url: 'https://docs.microsoft.com/power-automate/',
        category: 'Workflow Design',
        difficulty: 'Beginner',
        estimatedTime: 2
      },
      {
        id: 'resource-4',
        title: 'PL-500 Practice Exam Questions',
        description: 'Set of practice questions to test your knowledge',
        type: 'PRACTICE_EXAM',
        content: '50 practice questions covering all PL-500 exam topics with detailed explanations.',
        category: 'Exam Preparation',
        difficulty: 'Advanced',
        estimatedTime: 3
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });