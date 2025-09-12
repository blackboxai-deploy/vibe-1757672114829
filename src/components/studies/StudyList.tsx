"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/ui/loading-spinner";

export interface Study {
  id: string;
  mrn: string;
  patientName: string;
  accessionNo: string;
  studyDate: string;
  studyDescription: string;
  modality: string;
  hospitalName: string;
  referringPhysician: string;
  status: 'pending' | 'in_progress' | 'completed' | 'review_required' | 'finalized';
  assignedTo?: string;
  radiologist?: {
    id: string;
    name: string;
    avatar?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  bodyPart: string;
  studyTime?: string;
  reportId?: string;
  hl7Status?: 'pending' | 'sent' | 'failed' | 'retry';
}

interface StudyListProps {
  userRole: 'admin' | 'radiologist' | 'reviewer';
}

const StudyList: React.FC<StudyListProps> = ({ userRole }) => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModality, setFilterModality] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockStudies: Study[] = [
      {
        id: "1",
        mrn: "MRN001234",
        patientName: "John Doe",
        accessionNo: "ACC001234",
        studyDate: "2024-12-20",
        studyTime: "10:30 AM",
        studyDescription: "CT Chest with Contrast",
        modality: "CT",
        hospitalName: "General Hospital",
        referringPhysician: "Dr. Smith",
        status: "pending",
        priority: "high",
        bodyPart: "Chest",
        radiologist: {
          id: "2",
          name: "Dr. Michael Chen",
          avatar: "https://placehold.co/100x100?text=MC"
        }
      },
      {
        id: "2",
        mrn: "MRN001235",
        patientName: "Jane Smith",
        accessionNo: "ACC001235",
        studyDate: "2024-12-20",
        studyTime: "11:15 AM",
        studyDescription: "MRI Brain without Contrast",
        modality: "MRI",
        hospitalName: "City Medical Center",
        referringPhysician: "Dr. Johnson",
        status: "in_progress",
        priority: "urgent",
        bodyPart: "Brain",
        radiologist: {
          id: "2",
          name: "Dr. Michael Chen",
          avatar: "https://placehold.co/100x100?text=MC"
        }
      },
      {
        id: "3",
        mrn: "MRN001236",
        patientName: "Robert Johnson",
        accessionNo: "ACC001236",
        studyDate: "2024-12-19",
        studyTime: "3:45 PM",
        studyDescription: "X-Ray Knee AP/LAT",
        modality: "XR",
        hospitalName: "Orthopedic Clinic",
        referringPhysician: "Dr. Brown",
        status: "completed",
        priority: "medium",
        bodyPart: "Knee",
        reportId: "RPT001",
        hl7Status: "sent",
        radiologist: {
          id: "2",
          name: "Dr. Michael Chen",
          avatar: "https://placehold.co/100x100?text=MC"
        }
      },
      {
        id: "4",
        mrn: "MRN001237",
        patientName: "Emily Davis",
        accessionNo: "ACC001237",
        studyDate: "2024-12-19",
        studyTime: "2:20 PM",
        studyDescription: "Ultrasound Abdomen",
        modality: "US",
        hospitalName: "Women's Health Center",
        referringPhysician: "Dr. Wilson",
        status: "review_required",
        priority: "medium",
        bodyPart: "Abdomen",
        radiologist: {
          id: "3",
          name: "Dr. Emily Johnson",
          avatar: "https://placehold.co/100x100?text=EJ"
        }
      },
      {
        id: "5",
        mrn: "MRN001238",
        patientName: "Michael Brown",
        accessionNo: "ACC001238",
        studyDate: "2024-12-18",
        studyTime: "9:00 AM",
        studyDescription: "CT Abdomen/Pelvis with Contrast",
        modality: "CT",
        hospitalName: "Regional Hospital",
        referringPhysician: "Dr. Taylor",
        status: "finalized",
        priority: "low",
        bodyPart: "Abdomen",
        reportId: "RPT002",
        hl7Status: "sent",
        radiologist: {
          id: "2",
          name: "Dr. Michael Chen",
          avatar: "https://placehold.co/100x100?text=MC"
        }
      }
    ];

    setTimeout(() => {
      setStudies(mockStudies);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: Study['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
      case 'review_required':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200';
      case 'finalized':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: Study['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredStudies = studies.filter(study => {
    const matchesSearch = 
      study.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.accessionNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModality = filterModality === "all" || study.modality === filterModality;
    const matchesStatus = filterStatus === "all" || study.status === filterStatus;
    const matchesPriority = filterPriority === "all" || study.priority === filterPriority;
    
    return matchesSearch && matchesModality && matchesStatus && matchesPriority;
  });

  const studyStatusCounts = {
    pending: studies.filter(s => s.status === 'pending').length,
    in_progress: studies.filter(s => s.status === 'in_progress').length,
    review_required: studies.filter(s => s.status === 'review_required').length,
    completed: studies.filter(s => s.status === 'completed').length,
    finalized: studies.filter(s => s.status === 'finalized').length,
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-muted-foreground">Loading studies...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Study List
            <Badge variant="outline" className="text-sm">
              {filteredStudies.length} studies
            </Badge>
          </CardTitle>
          <CardDescription>
            Manage and track radiology studies across the workflow
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Search patients, MRN, accession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lg:col-span-2"
            />
            
            <Select value={filterModality} onValueChange={setFilterModality}>
              <SelectTrigger>
                <SelectValue placeholder="All Modalities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modalities</SelectItem>
                <SelectItem value="CT">CT</SelectItem>
                <SelectItem value="MRI">MRI</SelectItem>
                <SelectItem value="XR">X-Ray</SelectItem>
                <SelectItem value="US">Ultrasound</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="review_required">Review Required</SelectItem>
                <SelectItem value="finalized">Finalized</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {studyStatusCounts.pending}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">Pending</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {studyStatusCounts.in_progress}
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">In Progress</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {studyStatusCounts.review_required}
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Review Req.</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {studyStatusCounts.completed}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Completed</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {studyStatusCounts.finalized}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Finalized</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Cards */}
      <div className="space-y-4">
        {filteredStudies.map((study) => (
          <Card key={study.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Priority Indicator */}
                <div className="lg:col-span-1 flex lg:flex-col items-center lg:items-start space-x-2 lg:space-x-0 lg:space-y-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(study.priority)}`}></div>
                  <span className="text-xs font-medium text-muted-foreground capitalize">
                    {study.priority}
                  </span>
                </div>

                {/* Patient Info */}
                <div className="lg:col-span-3">
                  <h3 className="font-semibold text-lg">{study.patientName}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>MRN: {study.mrn}</p>
                    <p>Acc: {study.accessionNo}</p>
                  </div>
                </div>

                {/* Study Info */}
                <div className="lg:col-span-3">
                  <div className="space-y-1">
                    <h4 className="font-medium">{study.studyDescription}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {study.modality}
                      </Badge>
                      <span>{study.bodyPart}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {study.studyDate} • {study.studyTime}
                    </p>
                  </div>
                </div>

                {/* Hospital & Physician */}
                <div className="lg:col-span-2">
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{study.hospitalName}</p>
                    <p className="text-muted-foreground">{study.referringPhysician}</p>
                  </div>
                </div>

                {/* Assigned Radiologist */}
                <div className="lg:col-span-2">
                  {study.radiologist && (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={study.radiologist.avatar} alt={study.radiologist.name} />
                        <AvatarFallback className="text-xs">
                          {study.radiologist.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{study.radiologist.name}</p>
                        <p className="text-xs text-muted-foreground">Assigned</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Actions */}
                <div className="lg:col-span-1 flex flex-col items-end space-y-2">
                  <Badge className={`${getStatusColor(study.status)} text-xs`}>
                    {study.status.replace('_', ' ')}
                  </Badge>
                  
                  {study.hl7Status && (
                    <Badge 
                      variant={study.hl7Status === 'sent' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      HL7: {study.hl7Status}
                    </Badge>
                  )}

                  <div className="flex space-x-1">
                    {study.status === 'pending' && userRole === 'radiologist' && (
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    )}
                    {study.status === 'in_progress' && userRole === 'radiologist' && (
                      <Button size="sm" variant="outline">
                        Continue
                      </Button>
                    )}
                    {study.status === 'review_required' && userRole === 'reviewer' && (
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    )}
                    {(study.status === 'completed' || study.status === 'finalized') && (
                      <Button size="sm" variant="outline">
                        View Report
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No studies found matching your filters.</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearchTerm("");
              setFilterModality("all");
              setFilterStatus("all");
              setFilterPriority("all");
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudyList;