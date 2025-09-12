"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MinimalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            TeleRadiology Pro
          </h1>
          <p className="text-lg text-muted-foreground">
            Advanced Medical Imaging Platform with HL7 Integration
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Authentication System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">🔐</div>
                <span>Authentication</span>
              </CardTitle>
              <CardDescription>Role-based access control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="default">Admin</Badge>
                <Badge variant="secondary">Radiologist</Badge>
                <Badge variant="outline">Reviewer</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Study Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">📋</div>
                <span>Study Management</span>
              </CardTitle>
              <CardDescription>PACS integration simulation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pending Studies</span>
                  <Badge variant="destructive">12</Badge>
                </div>
                <div className="flex justify-between">
                  <span>In Progress</span>
                  <Badge className="bg-yellow-500">8</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Completed</span>
                  <Badge className="bg-green-500">45</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HL7 Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">🔗</div>
                <span>HL7 Integration</span>
              </CardTitle>
              <CardDescription>EMR/RIS connectivity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Success Rate</span>
                  <Badge className="bg-green-500">97.3%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Endpoints</span>
                  <Badge variant="outline">5/6</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Transmissions</span>
                  <Badge variant="secondary">892</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DICOM Viewer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm">👁️</div>
                <span>DICOM Viewer</span>
              </CardTitle>
              <CardDescription>Medical image viewing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>• OHIF Integration Ready</div>
                <div>• Multi-planar Reconstruction</div>
                <div>• Measurement Tools</div>
                <div>• Annotation Support</div>
              </div>
            </CardContent>
          </Card>

          {/* Report Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">📄</div>
                <span>Report Generation</span>
              </CardTitle>
              <CardDescription>Structured reporting system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>• Template Library</div>
                <div>• Voice Dictation</div>
                <div>• Digital Signatures</div>
                <div>• PDF Export</div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">📊</div>
                <span>Analytics</span>
              </CardTitle>
              <CardDescription>Performance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>• Turnaround Time Tracking</div>
                <div>• Productivity Metrics</div>
                <div>• Quality Indicators</div>
                <div>• SLA Monitoring</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Login Section */}
        <Card>
          <CardHeader>
            <CardTitle>Demo Access</CardTitle>
            <CardDescription>
              Try the teleradiology platform with different user roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                variant="outline"
              >
                <Badge variant="destructive">Admin</Badge>
                <div className="text-center">
                  <div className="font-medium">System Administrator</div>
                  <div className="text-sm text-muted-foreground">Full system access</div>
                </div>
              </Button>
              
              <Button 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                variant="outline"
              >
                <Badge>Radiologist</Badge>
                <div className="text-center">
                  <div className="font-medium">Dr. Michael Chen</div>
                  <div className="text-sm text-muted-foreground">Study reading & reporting</div>
                </div>
              </Button>
              
              <Button 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                variant="outline"
              >
                <Badge variant="secondary">Reviewer</Badge>
                <div className="text-center">
                  <div className="font-medium">Dr. Emily Johnson</div>
                  <div className="text-sm text-muted-foreground">Quality assurance</div>
                </div>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Demo Password: <code className="bg-muted px-2 py-1 rounded">password123</code>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">99.8%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">42min</div>
                <div className="text-sm text-muted-foreground">Avg Turnaround</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">12/15</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-600">1.2k</div>
                <div className="text-sm text-muted-foreground">Studies Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}