"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardStats {
  pendingStudies: number;
  completedReports: number;
  underReview: number;
  avgTurnaroundTime: string;
  todayAssigned: number;
  todayCompleted: number;
}

interface RecentActivity {
  id: string;
  type: "study_assigned" | "report_completed" | "review_required";
  description: string;
  time: string;
  priority: "low" | "medium" | "high" | "critical";
}

export default function DashboardHome() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [stats, setStats] = useState<DashboardStats>({
    pendingStudies: 0,
    completedReports: 0,
    underReview: 0,
    avgTurnaroundTime: "0h",
    todayAssigned: 0,
    todayCompleted: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [workloadProgress, setWorkloadProgress] = useState(0);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data based on user role
      let mockStats: DashboardStats;
      let mockActivity: RecentActivity[];

      switch (user?.role) {
        case "admin":
          mockStats = {
            pendingStudies: 47,
            completedReports: 234,
            underReview: 12,
            avgTurnaroundTime: "4.2h",
            todayAssigned: 28,
            todayCompleted: 31
          };
          mockActivity = [
            {
              id: "1",
              type: "study_assigned",
              description: "15 new studies assigned to Dr. Chen",
              time: "2 minutes ago",
              priority: "medium"
            },
            {
              id: "2",
              type: "report_completed",
              description: "CT Chest report completed by Dr. Rodriguez",
              time: "8 minutes ago",
              priority: "low"
            },
            {
              id: "3",
              type: "review_required",
              description: "MRI Brain report requires urgent review",
              time: "15 minutes ago",
              priority: "critical"
            }
          ];
          setWorkloadProgress(65);
          break;

        case "radiologist":
          mockStats = {
            pendingStudies: 12,
            completedReports: 89,
            underReview: 3,
            avgTurnaroundTime: "3.8h",
            todayAssigned: 8,
            todayCompleted: 11
          };
          mockActivity = [
            {
              id: "1",
              type: "study_assigned",
              description: "New CT Abdomen study assigned to you",
              time: "5 minutes ago",
              priority: "medium"
            },
            {
              id: "2",
              type: "study_assigned",
              description: "Urgent MRI Brain study assigned",
              time: "12 minutes ago",
              priority: "critical"
            },
            {
              id: "3",
              type: "report_completed",
              description: "Your X-Ray Chest report has been finalized",
              time: "22 minutes ago",
              priority: "low"
            }
          ];
          setWorkloadProgress(75);
          break;

        case "reviewer":
          mockStats = {
            pendingStudies: 8,
            completedReports: 156,
            underReview: 8,
            avgTurnaroundTime: "2.1h",
            todayAssigned: 5,
            todayCompleted: 7
          };
          mockActivity = [
            {
              id: "1",
              type: "review_required",
              description: "CT Chest report ready for your review",
              time: "3 minutes ago",
              priority: "medium"
            },
            {
              id: "2",
              type: "report_completed",
              description: "Approved MRI Spine report submitted",
              time: "18 minutes ago",
              priority: "low"
            },
            {
              id: "3",
              type: "review_required",
              description: "Complex case requires second opinion",
              time: "35 minutes ago",
              priority: "high"
            }
          ];
          setWorkloadProgress(55);
          break;

        default:
          mockStats = stats;
          mockActivity = [];
      }

      setStats(mockStats);
      setRecentActivity(mockActivity);
    };

    if (user) {
      loadDashboardData();

      // Add welcome notification
      addNotification({
        type: "system",
        title: "Welcome back!",
        message: `Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${user.name}. You have ${user.role === 'admin' ? '47 pending studies' : user.role === 'radiologist' ? '12 assigned studies' : '8 reports to review'} awaiting your attention.`,
        priority: "low"
      });
    }
  }, [user, addNotification]);

  const getDashboardTitle = () => {
    switch (user?.role) {
      case "admin":
        return "Administrative Dashboard";
      case "radiologist":
        return "Radiologist Workstation";
      case "reviewer":
        return "Quality Review Dashboard";
      default:
        return "Dashboard";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "study_assigned":
        return (
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case "report_completed":
        return (
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "review_required":
        return (
          <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getDashboardTitle()}</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user.name} • {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium capitalize">{user.status}</span>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-600 text-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Studies</CardDescription>
            <CardTitle className="text-3xl font-bold text-red-600">
              {stats.pendingStudies}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              +{stats.todayAssigned} assigned today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Reports</CardDescription>
            <CardTitle className="text-3xl font-bold text-green-600">
              {stats.completedReports}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              +{stats.todayCompleted} completed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Under Review</CardDescription>
            <CardTitle className="text-3xl font-bold text-yellow-600">
              {stats.underReview}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Quality assurance pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Turnaround</CardDescription>
            <CardTitle className="text-3xl font-bold text-blue-600">
              {stats.avgTurnaroundTime}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Target: &lt; 6h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workload Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
            <CardDescription>Your daily workload completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{workloadProgress}%</span>
              </div>
              <Progress value={workloadProgress} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.todayCompleted}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{stats.todayAssigned}</div>
                <div className="text-xs text-gray-500">Assigned</div>
              </div>
            </div>
            <Button className="w-full" onClick={() => window.location.href = '/dashboard/studies'}>
              View Study List
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(activity.priority)}`}
                        >
                          {activity.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.role !== "reviewer" && (
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => window.location.href = '/dashboard/viewer'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm">DICOM Viewer</span>
              </Button>
            )}
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => window.location.href = '/dashboard/reports'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm">Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2"
              onClick={() => window.location.href = '/dashboard/templates'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <span className="text-sm">Templates</span>
            </Button>
            {user.role === "admin" && (
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => window.location.href = '/dashboard/analytics'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm">Analytics</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}