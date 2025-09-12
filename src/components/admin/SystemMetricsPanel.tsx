"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface SystemMetrics {
  performance: {
    uptime: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    responseTime: number;
  };
  hl7: {
    totalTransmissions: number;
    successfulTransmissions: number;
    failedTransmissions: number;
    averageResponseTime: number;
    endpointsOnline: number;
    endpointsTotal: number;
  };
  studies: {
    totalStudies: number;
    studiesCompleted: number;
    studiesPending: number;
    averageTurnaroundTime: number;
  };
  users: {
    totalUsers: number;
    activeUsers: number;
    onlineUsers: number;
    sessions: number;
  };
}

const SystemMetricsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: SystemMetrics = {
        performance: {
          uptime: 99.8,
          cpuUsage: 42,
          memoryUsage: 67,
          diskUsage: 34,
          responseTime: 87
        },
        hl7: {
          totalTransmissions: 1247,
          successfulTransmissions: 1213,
          failedTransmissions: 34,
          averageResponseTime: 342,
          endpointsOnline: 5,
          endpointsTotal: 6
        },
        studies: {
          totalStudies: 2456,
          studiesCompleted: 2298,
          studiesPending: 158,
          averageTurnaroundTime: 45
        },
        users: {
          totalUsers: 48,
          activeUsers: 32,
          onlineUsers: 12,
          sessions: 15
        }
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };



  if (isLoading || !metrics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-muted-foreground">Loading system metrics...</span>
        </CardContent>
      </Card>
    );
  }

  const hl7SuccessRate = (metrics.hl7.successfulTransmissions / metrics.hl7.totalTransmissions) * 100;
  const studiesCompletionRate = (metrics.studies.studiesCompleted / metrics.studies.totalStudies) * 100;
  const endpointHealth = (metrics.hl7.endpointsOnline / metrics.hl7.endpointsTotal) * 100;

  return (
    <div className="space-y-6">
      {/* System Performance */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>
            Real-time system resource utilization and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">System Uptime</span>
                <span className={`text-sm font-bold ${getStatusColor(metrics.performance.uptime)}`}>
                  {metrics.performance.uptime}%
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={metrics.performance.uptime} className="h-2" />
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className={`text-sm font-bold ${getStatusColor(100 - metrics.performance.cpuUsage)}`}>
                  {metrics.performance.cpuUsage}%
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={metrics.performance.cpuUsage} className="h-2" />
                <p className="text-xs text-muted-foreground">Average load</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className={`text-sm font-bold ${getStatusColor(100 - metrics.performance.memoryUsage)}`}>
                  {metrics.performance.memoryUsage}%
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={metrics.performance.memoryUsage} className="h-2" />
                <p className="text-xs text-muted-foreground">8GB / 12GB</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Disk Usage</span>
                <span className={`text-sm font-bold ${getStatusColor(100 - metrics.performance.diskUsage)}`}>
                  {metrics.performance.diskUsage}%
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={metrics.performance.diskUsage} className="h-2" />
                <p className="text-xs text-muted-foreground">170GB / 500GB</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Average Response Time
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  API endpoints performance
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {metrics.performance.responseTime}ms
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  Target: &lt; 100ms
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HL7 Integration Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>HL7 Integration Metrics</CardTitle>
          <CardDescription>
            HL7 transmission statistics and endpoint health monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {metrics.hl7.successfulTransmissions}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Successful</div>
            </div>

            <div className="text-center p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {metrics.hl7.failedTransmissions}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">Failed</div>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.hl7.averageResponseTime}ms
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Avg Response</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Success Rate</span>
              <Badge 
                className={hl7SuccessRate >= 95 ? "bg-green-500" : hl7SuccessRate >= 90 ? "bg-yellow-500" : "bg-red-500"}
              >
                {hl7SuccessRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={hl7SuccessRate} className="h-2" />

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Endpoint Health</span>
              <Badge 
                className={endpointHealth === 100 ? "bg-green-500" : endpointHealth >= 80 ? "bg-yellow-500" : "bg-red-500"}
              >
                {metrics.hl7.endpointsOnline}/{metrics.hl7.endpointsTotal} Online
              </Badge>
            </div>
            <Progress value={endpointHealth} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Study Processing Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Study Processing Metrics</CardTitle>
          <CardDescription>
            Study workflow performance and radiologist productivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Study Completion Rate</span>
                <Badge className="bg-blue-500">
                  {studiesCompletionRate.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={studiesCompletionRate} className="h-2" />
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {metrics.studies.averageTurnaroundTime}m
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Avg Turnaround Time</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Target: &lt; 60m</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {metrics.studies.studiesPending}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Studies Pending</div>
              </div>

              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {metrics.users.onlineUsers}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Radiologists Online</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Activity */}
      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
          <CardDescription>
            Current user sessions and system engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{metrics.users.totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{metrics.users.activeUsers}</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{metrics.users.onlineUsers}</div>
              <div className="text-xs text-muted-foreground">Online Now</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{metrics.users.sessions}</div>
              <div className="text-xs text-muted-foreground">Active Sessions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMetricsPanel;