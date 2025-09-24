'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Plus, Edit, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

// Mock data - replace with real data from Supabase
const mockTeachingSkills = [
  {
    id: '1',
    title: 'JavaScript Programming',
    description: 'Full-stack JavaScript development including Node.js, React, and Express',
    category: 'Programming',
    difficulty: 'intermediate',
    tags: ['javascript', 'react', 'nodejs'],
    level: 'expert'
  },
  {
    id: '2',
    title: 'Guitar Playing',
    description: 'Acoustic guitar for beginners and intermediate players',
    category: 'Music',
    difficulty: 'beginner',
    tags: ['guitar', 'music', 'acoustic'],
    level: 'intermediate'
  }
];

const mockLearningSkills = [
  {
    id: '3',
    title: 'Spanish Language',
    description: 'Conversational Spanish for travel and business',
    category: 'Language',
    difficulty: 'beginner',
    tags: ['spanish', 'language', 'conversation'],
    level: 'beginner'
  },
  {
    id: '4',
    title: 'Photography',
    description: 'Digital photography and photo editing techniques',
    category: 'Creative',
    difficulty: 'intermediate',
    tags: ['photography', 'creative', 'editing'],
    level: 'beginner'
  }
];

const categories = ['Programming', 'Creative', 'Language', 'Music', 'Health', 'Business', 'Other'];
const difficulties = ['beginner', 'intermediate', 'advanced'];
const levels = ['beginner', 'intermediate', 'advanced', 'expert'];

export default function MySkillsPage() {
  const [teachingSkills, setTeachingSkills] = useState(mockTeachingSkills);
  const [learningSkills, setLearningSkills] = useState(mockLearningSkills);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [skillType, setSkillType] = useState<'teach' | 'learn'>('teach');
  const [editingSkill, setEditingSkill] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    tags: '',
    level: 'beginner'
  });

  const handleAddSkill = (type: 'teach' | 'learn') => {
    setSkillType(type);
    setEditingSkill(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      difficulty: 'beginner',
      tags: '',
      level: 'beginner'
    });
    setIsAddDialogOpen(true);
  };

  const handleEditSkill = (skill: any, type: 'teach' | 'learn') => {
    setSkillType(type);
    setEditingSkill(skill);
    setFormData({
      title: skill.title,
      description: skill.description,
      category: skill.category,
      difficulty: skill.difficulty,
      tags: skill.tags.join(', '),
      level: skill.level
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const skillData = {
      id: editingSkill?.id || Date.now().toString(),
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    if (editingSkill) {
      // Update existing skill
      if (skillType === 'teach') {
        setTeachingSkills(prev => prev.map(skill => 
          skill.id === editingSkill.id ? skillData : skill
        ));
      } else {
        setLearningSkills(prev => prev.map(skill => 
          skill.id === editingSkill.id ? skillData : skill
        ));
      }
      toast.success('Skill updated successfully');
    } else {
      // Add new skill
      if (skillType === 'teach') {
        setTeachingSkills(prev => [...prev, skillData]);
      } else {
        setLearningSkills(prev => [...prev, skillData]);
      }
      toast.success('Skill added successfully');
    }

    setIsAddDialogOpen(false);
  };

  const handleDeleteSkill = (skillId: string, type: 'teach' | 'learn') => {
    if (type === 'teach') {
      setTeachingSkills(prev => prev.filter(skill => skill.id !== skillId));
    } else {
      setLearningSkills(prev => prev.filter(skill => skill.id !== skillId));
    }
    toast.success('Skill removed');
  };

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const SkillCard = ({ skill, type, onEdit, onDelete }: any) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{skill.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{skill.category}</Badge>
              <Badge className={getDifficultyColor(skill.difficulty)}>
                {skill.difficulty}
              </Badge>
              <Badge className={getLevelColor(skill.level)}>
                My Level: {skill.level}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(skill, type)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(skill.id, type)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {skill.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {skill.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <p className="text-gray-600 mt-2">
            Manage the skills you can teach and want to learn
          </p>
        </div>

        {/* Skills Tabs */}
        <Tabs defaultValue="teaching" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="teaching" className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              Teaching ({teachingSkills.length})
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Learning ({learningSkills.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teaching" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Skills I Can Teach</h2>
                <p className="text-gray-600">Share your expertise with others</p>
              </div>
              <Button onClick={() => handleAddSkill('teach')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Teaching Skill
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachingSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  type="teach"
                  onEdit={handleEditSkill}
                  onDelete={handleDeleteSkill}
                />
              ))}
            </div>

            {teachingSkills.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teaching skills yet</h3>
                <p className="text-gray-600 mb-4">
                  Add skills you'd like to teach and help others learn
                </p>
                <Button onClick={() => handleAddSkill('teach')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Teaching Skill
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Skills I Want to Learn</h2>
                <p className="text-gray-600">Connect with teachers for these skills</p>
              </div>
              <Button onClick={() => handleAddSkill('learn')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Learning Goal
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  type="learn"
                  onEdit={handleEditSkill}
                  onDelete={handleDeleteSkill}
                />
              ))}
            </div>

            {learningSkills.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No learning goals yet</h3>
                <p className="text-gray-600 mb-4">
                  Add skills you'd like to learn and find teachers
                </p>
                <Button onClick={() => handleAddSkill('learn')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Learning Goal
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add/Edit Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? 'Edit' : 'Add'} {skillType === 'teach' ? 'Teaching' : 'Learning'} Skill
              </DialogTitle>
              <DialogDescription>
                {skillType === 'teach' 
                  ? 'Add a skill you can teach to others'
                  : 'Add a skill you want to learn'
                }
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Skill Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., JavaScript Programming"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what you'll teach or want to learn"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="level">
                  {skillType === 'teach' ? 'Your Skill Level' : 'Desired Learning Level'}
                </Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="javascript, react, programming"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSkill ? 'Update' : 'Add'} Skill
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}