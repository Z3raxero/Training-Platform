"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, Clock, Award, BookOpen, Upload, Target, TrendingUp, Plus, FileText } from "lucide-react";
import ExamResultUpload from "@/components/ExamResultUpload";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  acquiredDate?: string;
  expiryDate?: string;
  status: "ACTIVE" | "EXPIRED" | "IN_PROGRESS" | "NOT_STARTED";
  progress: number;
  certificateUrl?: string;
  notes?: string;
}

interface StudyPlan {
  id: string;
  title: string;
  description?: string;
  progress: number;
  targetDate?: string;
  startDate: string;
  totalDays: number;
  isActive: boolean;
  notes?: string;
  studyTasks?: StudyTask[];
}

interface StudyTask {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  order: number;
}

interface ExamResult {
  id: string;
  title: string;
  examName: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  passed?: boolean;
  examDate?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  notes?: string;
}

interface TrainingPlan {
  id: string;
  title: string;
  targetCertification: string;
  currentSkillLevel: string;
  studyHoursPerWeek: number;
  targetDate?: string;
  generatedPlan: string;
  isActive: boolean;
}

export default function CertificationTracker() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState("demo-user-1"); // Demo user ID

  // Form states
  const [showCertForm, setShowCertForm] = useState(false);
  const [showStudyPlanForm, setShowStudyPlanForm] = useState(false);
  const [showTrainingPlanForm, setShowTrainingPlanForm] = useState(false);

  // Certification form state
  const [certForm, setCertForm] = useState({
    name: "",
    issuer: "",
    acquiredDate: "",
    expiryDate: "",
    status: "IN_PROGRESS",
    progress: 0,
    notes: ""
  });

  // Study plan form state
  const [studyPlanForm, setStudyPlanForm] = useState({
    title: "",
    description: "",
    targetDate: "",
    totalDays: 30,
    notes: ""
  });

  // Training plan form state
  const [trainingPlanForm, setTrainingPlanForm] = useState({
    targetCertification: "",
    currentSkillLevel: "Beginner",
    studyHoursPerWeek: 10,
    targetDate: "",
    generateAIPlan: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [certsRes, plansRes, examsRes, trainingRes] = await Promise.all([
        fetch(`/api/certifications?userId=${userId}`),
        fetch(`/api/study-plans?userId=${userId}`),
        fetch(`/api/exam-results?userId=${userId}`),
        fetch(`/api/training-plans?userId=${userId}`)
      ]);

      const [certs, plans, exams, training] = await Promise.all([
        certsRes.json(),
        plansRes.json(),
        examsRes.json(),
        trainingRes.json()
      ]);

      setCertifications(certs);
      setStudyPlans(plans);
      setExamResults(exams);
      setTrainingPlans(training);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...certForm, userId })
      });

      if (response.ok) {
        await fetchData();
        setShowCertForm(false);
        setCertForm({
          name: "",
          issuer: "",
          acquiredDate: "",
          expiryDate: "",
          status: "IN_PROGRESS",
          progress: 0,
          notes: ""
        });
      }
    } catch (error) {
      console.error('Error creating certification:', error);
    }
  };

  const handleCreateStudyPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/study-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...studyPlanForm, userId })
      });

      if (response.ok) {
        await fetchData();
        setShowStudyPlanForm(false);
        setStudyPlanForm({
          title: "",
          description: "",
          targetDate: "",
          totalDays: 30,
          notes: ""
        });
      }
    } catch (error) {
      console.error('Error creating study plan:', error);
    }
  };

  const handleCreateTrainingPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/training-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...trainingPlanForm, userId })
      });

      if (response.ok) {
        await fetchData();
        setShowTrainingPlanForm(false);
        setTrainingPlanForm({
          targetCertification: "",
          currentSkillLevel: "Beginner",
          studyHoursPerWeek: 10,
          targetDate: "",
          generateAIPlan: true
        });
      }
    } catch (error) {
      console.error('Error creating training plan:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "EXPIRED": return "bg-red-100 text-red-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "NOT_STARTED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysLeft = (targetDate?: string) => {
    if (!targetDate) return 0;
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading certification tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Certification Tracker
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Track your certifications, manage study plans, and optimize your learning journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {certifications.filter(cert => cert.status === "ACTIVE").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently valid</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {certifications.filter(cert => cert.status === "IN_PROGRESS").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently studying</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Plans</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyPlans.length}</div>
              <p className="text-xs text-muted-foreground">Active plans</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Until Next Exam</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.min(...certifications.map(cert => getDaysLeft(cert.targetDate)).filter(days => days > 0), 30)}
              </div>
              <p className="text-xs text-muted-foreground">Closest deadline</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="certifications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="study-plans">Study Plans</TabsTrigger>
            <TabsTrigger value="exam-results">Exam Results</TabsTrigger>
            <TabsTrigger value="training-plans">AI Training Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="certifications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Certifications</h2>
              <Dialog open={showCertForm} onOpenChange={setShowCertForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Certification</DialogTitle>
                    <DialogDescription>
                      Add a new certification to track your progress
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCertification} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Certification Name</Label>
                      <Input
                        id="name"
                        value={certForm.name}
                        onChange={(e) => setCertForm({...certForm, name: e.target.value})}
                        placeholder="e.g., Microsoft PL-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="issuer">Issuer</Label>
                      <Input
                        id="issuer"
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
                        placeholder="e.g., Microsoft"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={certForm.status} onValueChange={(value) => setCertForm({...certForm, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="EXPIRED">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="progress">Progress (%)</Label>
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={certForm.progress}
                        onChange={(e) => setCertForm({...certForm, progress: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={certForm.notes}
                        onChange={(e) => setCertForm({...certForm, notes: e.target.value})}
                        placeholder="Additional notes..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Add Certification</Button>
                      <Button type="button" variant="outline" onClick={() => setShowCertForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                        <CardDescription>{cert.issuer}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(cert.status)}>
                        {cert.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Acquired Date</p>
                        <p className="font-medium">{cert.acquiredDate || "Not yet acquired"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expiry Date</p>
                        <p className="font-medium">{cert.expiryDate || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <div className="mt-1">
                          <Progress value={cert.progress} className="w-full" />
                          <p className="text-xs text-muted-foreground mt-1">{cert.progress}% complete</p>
                        </div>
                      </div>
                    </div>
                    {cert.notes && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm">{cert.notes}</p>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">View Details</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {certifications.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">No certifications yet</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add your first certification to start tracking your progress
                    </p>
                    <Button onClick={() => setShowCertForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Certification
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="study-plans" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Study Plans</h2>
              <Dialog open={showStudyPlanForm} onOpenChange={setShowStudyPlanForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Study Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Study Plan</DialogTitle>
                    <DialogDescription>
                      Create a new study plan to organize your learning
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateStudyPlan} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Plan Title</Label>
                      <Input
                        id="title"
                        value={studyPlanForm.title}
                        onChange={(e) => setStudyPlanForm({...studyPlanForm, title: e.target.value})}
                        placeholder="e.g., PL-500 Study Plan"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={studyPlanForm.description}
                        onChange={(e) => setStudyPlanForm({...studyPlanForm, description: e.target.value})}
                        placeholder="Brief description of your study plan..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalDays">Total Duration (days)</Label>
                      <Input
                        id="totalDays"
                        type="number"
                        min="1"
                        value={studyPlanForm.totalDays}
                        onChange={(e) => setStudyPlanForm({...studyPlanForm, totalDays: parseInt(e.target.value) || 30})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetDate">Target Date</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        value={studyPlanForm.targetDate}
                        onChange={(e) => setStudyPlanForm({...studyPlanForm, targetDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={studyPlanForm.notes}
                        onChange={(e) => setStudyPlanForm({...studyPlanForm, notes: e.target.value})}
                        placeholder="Additional notes..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Create Plan</Button>
                      <Button type="button" variant="outline" onClick={() => setShowStudyPlanForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {studyPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <Badge variant={plan.progress === 100 ? "default" : "secondary"}>
                        {plan.progress === 100 ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <div className="mt-1">
                          <Progress value={plan.progress} className="w-full" />
                          <p className="text-xs text-muted-foreground mt-1">{plan.progress}% complete</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Days Left</p>
                        <p className="font-medium">{getDaysLeft(plan.targetDate)} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Duration</p>
                        <p className="font-medium">{plan.totalDays} days</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">View Plan</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {studyPlans.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">No study plans yet</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create your first study plan to organize your learning
                    </p>
                    <Button onClick={() => setShowStudyPlanForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Study Plan
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="exam-results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Exam Results & Certificates
                </CardTitle>
                <CardDescription>
                  Upload and manage your exam results and certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">Upload Exam Results</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Drag and drop your exam results or certificates here
                  </p>
                  <Button>Choose Files</Button>
                </div>
                
                {examResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Recent Exam Results</h3>
                    <div className="grid gap-4">
                      {examResults.slice(0, 3).map((result) => (
                        <Card key={result.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{result.title}</h4>
                                <p className="text-sm text-muted-foreground">{result.examName}</p>
                              </div>
                              <div className="text-right">
                                {result.score && result.maxScore && (
                                  <p className="font-medium">{result.score}/{result.maxScore}</p>
                                )}
                                {result.percentage && (
                                  <p className="text-sm text-muted-foreground">{result.percentage}%</p>
                                )}
                                {result.passed !== undefined && (
                                  <Badge variant={result.passed ? "default" : "destructive"}>
                                    {result.passed ? "Passed" : "Failed"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training-plans" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">AI Training Plans</h2>
              <Dialog open={showTrainingPlanForm} onOpenChange={setShowTrainingPlanForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate AI Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Generate AI Training Plan</DialogTitle>
                    <DialogDescription>
                      Create a custom training plan powered by AI
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTrainingPlan} className="space-y-4">
                    <div>
                      <Label htmlFor="targetCertification">Target Certification</Label>
                      <Input
                        id="targetCertification"
                        value={trainingPlanForm.targetCertification}
                        onChange={(e) => setTrainingPlanForm({...trainingPlanForm, targetCertification: e.target.value})}
                        placeholder="e.g., Microsoft PL-500 Power Platform Developer"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentSkillLevel">Current Skill Level</Label>
                      <Select 
                        value={trainingPlanForm.currentSkillLevel} 
                        onValueChange={(value) => setTrainingPlanForm({...trainingPlanForm, currentSkillLevel: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="studyHoursPerWeek">Study Time Available (hours/week)</Label>
                      <Input
                        id="studyHoursPerWeek"
                        type="number"
                        min="1"
                        value={trainingPlanForm.studyHoursPerWeek}
                        onChange={(e) => setTrainingPlanForm({...trainingPlanForm, studyHoursPerWeek: parseInt(e.target.value) || 10})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetDate">Target Completion Date</Label>
                      <Input
                        id="targetDate"
                        type="date"
                        value={trainingPlanForm.targetDate}
                        onChange={(e) => setTrainingPlanForm({...trainingPlanForm, targetDate: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Generate AI Training Plan</Button>
                      <Button type="button" variant="outline" onClick={() => setShowTrainingPlanForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4">
              {trainingPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription>{plan.targetCertification}</CardDescription>
                      </div>
                      <Badge variant={plan.isActive ? "default" : "secondary"}>
                        {plan.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Skill Level</p>
                        <p className="font-medium">{plan.currentSkillLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Study Hours/Week</p>
                        <p className="font-medium">{plan.studyHoursPerWeek} hours</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Target Date</p>
                        <p className="font-medium">{plan.targetDate || "Not set"}</p>
                      </div>
                    </div>
                    {plan.generatedPlan && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Generated Plan</p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md max-h-40 overflow-y-auto">
                          <p className="text-sm whitespace-pre-wrap">{plan.generatedPlan}</p>
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">View Full Plan</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {trainingPlans.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">No AI training plans yet</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Generate your first AI-powered training plan
                    </p>
                    <Button onClick={() => setShowTrainingPlanForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate AI Plan
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}