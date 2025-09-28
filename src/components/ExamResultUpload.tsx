"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, FileText, Plus } from "lucide-react";

interface ExamResultUploadProps {
  onUploadSuccess: () => void;
  userId: string;
}

export default function ExamResultUpload({ onUploadSuccess, userId }: ExamResultUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    examName: "",
    score: "",
    maxScore: "",
    passed: "",
    examDate: "",
    notes: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('examName', formData.examName);
      formDataObj.append('userId', userId);
      
      if (formData.score) formDataObj.append('score', formData.score);
      if (formData.maxScore) formDataObj.append('maxScore', formData.maxScore);
      if (formData.passed) formDataObj.append('passed', formData.passed);
      if (formData.examDate) formDataObj.append('examDate', formData.examDate);
      if (formData.notes) formDataObj.append('notes', formData.notes);
      if (selectedFile) formDataObj.append('file', selectedFile);

      const response = await fetch('/api/exam-results/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        onUploadSuccess();
        setIsOpen(false);
        setFormData({
          title: "",
          examName: "",
          score: "",
          maxScore: "",
          passed: "",
          examDate: "",
          notes: ""
        });
        setSelectedFile(null);
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading exam result:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Upload Exam Result
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Exam Result</DialogTitle>
          <DialogDescription>
            Upload your exam results and certificates to track your progress
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Result Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., AZ-900 Practice Test 1"
                required
              />
            </div>
            <div>
              <Label htmlFor="examName">Exam Name</Label>
              <Input
                id="examName"
                value={formData.examName}
                onChange={(e) => setFormData({...formData, examName: e.target.value})}
                placeholder="e.g., Microsoft Azure Fundamentals"
                required
              />
            </div>
            <div>
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                min="0"
                value={formData.score}
                onChange={(e) => setFormData({...formData, score: e.target.value})}
                placeholder="e.g., 840"
              />
            </div>
            <div>
              <Label htmlFor="maxScore">Max Score</Label>
              <Input
                id="maxScore"
                type="number"
                min="1"
                value={formData.maxScore}
                onChange={(e) => setFormData({...formData, maxScore: e.target.value})}
                placeholder="e.g., 1000"
              />
            </div>
            <div>
              <Label htmlFor="passed">Result</Label>
              <Select value={formData.passed} onValueChange={(value) => setFormData({...formData, passed: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Passed</SelectItem>
                  <SelectItem value="false">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="examDate">Exam Date</Label>
              <Input
                id="examDate"
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({...formData, examDate: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes about the exam result..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="file">Upload File (Optional)</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF, JPG, PNG (MAX. 10MB)
                    </p>
                  </div>
                  <input 
                    id="file" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {selectedFile && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Result'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}