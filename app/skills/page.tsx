'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Search, Filter, BookOpen, Clock, Users } from 'lucide-react';

// Mock data - replace with real data from Supabase
const mockSkills = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming including variables, functions, and DOM manipulation.',
    category: 'Programming',
    difficulty: 'beginner',
    tags: ['javascript', 'web-development', 'programming'],
    teacher: {
      name: 'Alex Johnson',
      avatar: null,
      level: 5,
      points: 450
    },
    availability: 'weekends'
  },
  {
    id: '2',
    title: 'Digital Photography Basics',
    description: 'Master composition, lighting, and editing techniques for stunning photographs.',
    category: 'Creative',
    difficulty: 'intermediate',
    tags: ['photography', 'creative', 'editing'],
    teacher: {
      name: 'Sarah Chen',
      avatar: null,
      level: 8,
      points: 780
    },
    availability: 'evenings'
  },
  {
    id: '3',
    title: 'Spanish Conversation',
    description: 'Practice conversational Spanish with a native speaker and improve your fluency.',
    category: 'Language',
    difficulty: 'intermediate',
    tags: ['spanish', 'language', 'conversation'],
    teacher: {
      name: 'Maria Rodriguez',
      avatar: null,
      level: 12,
      points: 1200
    },
    availability: 'flexible'
  },
  {
    id: '4',
    title: 'Guitar for Beginners',
    description: 'Learn basic chords, strumming patterns, and play your first songs on acoustic guitar.',
    category: 'Music',
    difficulty: 'beginner',
    tags: ['guitar', 'music', 'beginner'],
    teacher: {
      name: 'Mike Wilson',
      avatar: null,
      level: 6,
      points: 590
    },
    availability: 'weekdays'
  },
  {
    id: '5',
    title: 'React Development',
    description: 'Build modern web applications using React, hooks, and component-based architecture.',
    category: 'Programming',
    difficulty: 'advanced',
    tags: ['react', 'javascript', 'frontend'],
    teacher: {
      name: 'David Park',
      avatar: null,
      level: 15,
      points: 1500
    },
    availability: 'evenings'
  },
  {
    id: '6',
    title: 'Yoga & Mindfulness',
    description: 'Learn basic yoga poses, breathing techniques, and mindfulness practices for wellbeing.',
    category: 'Health',
    difficulty: 'beginner',
    tags: ['yoga', 'mindfulness', 'wellness'],
    teacher: {
      name: 'Emma Thompson',
      avatar: null,
      level: 9,
      points: 890
    },
    availability: 'mornings'
  }
];

const categories = ['All', 'Programming', 'Creative', 'Language', 'Music', 'Health', 'Business', 'Other'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

export default function SkillsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [skills] = useState(mockSkills);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || skill.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Skills</h1>
          <p className="text-gray-600 mt-2">
            Discover skills you can learn from the community
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search skills, tags, or descriptions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === 'All' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <Card key={skill.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{skill.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{skill.category}</Badge>
                      <Badge className={getDifficultyColor(skill.difficulty)}>
                        {skill.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {skill.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {skill.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Teacher Info */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{skill.teacher.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>Level {skill.teacher.level}</span>
                        <span>•</span>
                        <span>{skill.teacher.points} points</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {skill.availability}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or filters to find the skills you're looking for.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}