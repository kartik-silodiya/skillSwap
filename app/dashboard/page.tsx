'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { createClient } from '@/lib/supabase/client';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  MessageCircle, 
  TrendingUp, 
  Award,
  Plus,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    skillsToTeach: 0,
    skillsToLearn: 0,
    activeMatches: 0,
    upcomingSessions: 0,
    unreadMessages: 0,
    totalPoints: 0,
    level: 1
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const quickStats = [
    {
      title: 'Skills to Teach',
      value: stats.skillsToTeach,
      icon: BookOpen,
      color: 'bg-blue-500',
      href: '/my-skills?tab=teaching'
    },
    {
      title: 'Skills to Learn',
      value: stats.skillsToLearn,
      icon: BookOpen,
      color: 'bg-green-500',
      href: '/my-skills?tab=learning'
    },
    {
      title: 'Active Matches',
      value: stats.activeMatches,
      icon: Users,
      color: 'bg-purple-500',
      href: '/matches'
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: Calendar,
      color: 'bg-orange-500',
      href: '/sessions'
    }
  ];

  const getPointsToNextLevel = (currentPoints: number, level: number) => {
    const pointsForNextLevel = level * 100; // 100 points per level
    return Math.max(0, pointsForNextLevel - currentPoints);
  };

  const getLevelProgress = (currentPoints: number, level: number) => {
    const pointsForCurrentLevel = (level - 1) * 100;
    const pointsForNextLevel = level * 100;
    const progressInCurrentLevel = currentPoints - pointsForCurrentLevel;
    const totalPointsInLevel = pointsForNextLevel - pointsForCurrentLevel;
    return (progressInCurrentLevel / totalPointsInLevel) * 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your skill exchanges today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">Level {stats.level}</div>
                <p className="text-gray-600">{stats.totalPoints} points</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Level {stats.level + 1}</span>
                  <span>{getPointsToNextLevel(stats.totalPoints, stats.level)} points to go</span>
                </div>
                <Progress value={getLevelProgress(stats.totalPoints, stats.level)} />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/skills">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Skills
                </Button>
              </Link>
              <Link href="/my-skills">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Skill
                </Button>
              </Link>
              <Link href="/sessions">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
              </Link>
              <Link href="/matches">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Find Matches
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Messages
                </span>
                {stats.unreadMessages > 0 && (
                  <Badge variant="destructive">{stats.unreadMessages}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No recent messages</p>
                <p className="text-sm">Start a conversation with your matches!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>Your scheduled learning and teaching sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No upcoming sessions</p>
              <p className="text-sm">Book your first session to get started!</p>
              <Link href="/sessions">
                <Button className="mt-4">Schedule Session</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}