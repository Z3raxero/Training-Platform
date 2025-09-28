"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ExternalLink, Clock, FileText, Video, Trophy, GraduationCap } from "lucide-react";

interface StudyResource {
  id: string;
  title: string;
  description?: string;
  type: 'DOCUMENT' | 'VIDEO' | 'PRACTICE_EXAM' | 'PROJECT' | 'ARTICLE' | 'TUTORIAL';
  url?: string;
  content?: string;
  category?: string;
  difficulty?: string;
  estimatedTime?: number;
  isActive: boolean;
}

interface LearningResourcesProps {
  userId: string;
}

export default function LearningResources({ userId }: LearningResourcesProps) {
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedCategory, selectedType]);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/study-resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    setFilteredResources(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="h-4 w-4" />;
      case 'PRACTICE_EXAM': return <Trophy className="h-4 w-4" />;
      case 'PROJECT': return <FileText className="h-4 w-4" />;
      case 'TUTORIAL': return <GraduationCap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO': return "bg-red-100 text-red-800";
      case 'PRACTICE_EXAM': return "bg-yellow-100 text-yellow-800";
      case 'PROJECT': return "bg-green-100 text-green-800";
      case 'TUTORIAL': return "bg-blue-100 text-blue-800";
      case 'DOCUMENT': return "bg-purple-100 text-purple-800";
      case 'ARTICLE': return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return "bg-green-100 text-green-800";
      case 'Intermediate': return "bg-yellow-100 text-yellow-800";
      case 'Advanced': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Get unique categories and types for filters
  const categories = Array.from(new Set(resources.map(r => r.category).filter(Boolean)));
  const types = Array.from(new Set(resources.map(r => r.type)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Learning Resources</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Access curated learning materials and sample projects
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <Badge className={getTypeColor(resource.type)}>
                    {resource.type.replace('_', ' ')}
                  </Badge>
                </div>
                {resource.difficulty && (
                  <Badge className={getDifficultyColor(resource.difficulty)}>
                    {resource.difficulty}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
              {resource.category && (
                <CardDescription>{resource.category}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {resource.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {resource.description}
                </p>
              )}
              
              {resource.content && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-sm">{resource.content}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                {resource.estimatedTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {resource.estimatedTime}h
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {resource.url ? (
                  <Button size="sm" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </a>
                  </Button>
                ) : (
                  <Button size="sm">
                    <BookOpen className="h-3 w-3 mr-1" />
                    View
                  </Button>
                )}
                <Button size="sm" variant="outline">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}