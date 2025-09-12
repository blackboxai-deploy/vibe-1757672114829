"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
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
                <span>🔐 Authentication</span>
              </CardTitle>
              <CardDescription>Role-based access control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="destructive">Admin</Badge>
                <Badge variant="secondary">Radiologist</Badge>
                <Badge variant="outline">Reviewer</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Study Management */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Study Management</CardTitle>
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
              <CardTitle>🔗 HL7 Integration</CardTitle>
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
              <CardTitle>👁️ DICOM Viewer</CardTitle>
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
              <CardTitle>📄 Report Generation</CardTitle>
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
              <CardTitle>📊 Analytics</CardTitle>
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

        {/* HL7 Integration Demo */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔗</span>
              <span>HL7 Integration Demo</span>
            </CardTitle>
            <CardDescription>
              Experience the complete HL7 workflow from report finalization to EMR delivery
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              See how finalized radiology reports are automatically converted to HL7 ORU^R01 messages 
              and transmitted to hospital EMR/RIS systems via MLLP or HTTPS protocols.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/demo/hl7-workflow">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  🚀 Try HL7 Integration Demo
                </Button>
              </Link>
              <div className="text-xs text-muted-foreground">
                Complete workflow: Report → HL7 → EMR
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}