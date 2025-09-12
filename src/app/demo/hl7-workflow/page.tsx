"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function HL7WorkflowDemo() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hl7Results, setHL7Results] = useState<any>(null);

  const mockReport = {
    mrn: "MRN001234",
    patientName: "John Doe",
    accessionNo: "ACC001234",
    studyDescription: "CT Chest with Contrast",
    studyDate: "2024-12-20",
    modality: "CT",
    hospitalName: "General Hospital",
    referringPhysician: "Dr. Smith",
    findings: "The CT chest examination demonstrates normal lung parenchyma without evidence of consolidation, nodules, or masses. The pleural spaces are clear without effusion or pneumothorax. The heart size is normal. The mediastinal and hilar contours are within normal limits.",
    impression: "Normal CT chest examination. No acute cardiopulmonary abnormalities identified.",
    recommendations: "No further imaging required at this time. Clinical correlation recommended for any persistent symptoms."
  };

  const steps = [
    { id: 1, title: "Report Creation", description: "Radiologist creates structured report" },
    { id: 2, title: "Digital Signature", description: "Report digitally signed for finalization" },
    { id: 3, title: "HL7 Generation", description: "HL7 ORU^R01 message generated" },
    { id: 4, title: "EMR Transmission", description: "Message sent to hospital EMR/RIS systems" },
    { id: 5, title: "Delivery Confirmation", description: "Transmission status confirmed" }
  ];

  const simulateHL7Workflow = async () => {
    setIsProcessing(true);
    setStep(1);

    // Step 1: Report Creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStep(2);

    // Step 2: Digital Signature  
    await new Promise(resolve => setTimeout(resolve, 800));
    setStep(3);

    // Step 3: HL7 Generation
    await new Promise(resolve => setTimeout(resolve, 1200));
    setStep(4);

    // Step 4: EMR Transmission
    try {
      const response = await fetch('/api/hl7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: 'RPT001',
          studyId: 'study_001',
          endpointId: 'endpoint_1',
          messageContent: mockReport
        })
      });

      const data = await response.json();
      setHL7Results(data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep(5);
    } catch (error) {
      console.error('HL7 transmission error:', error);
    }

    setIsProcessing(false);
  };

  const generateHL7Message = () => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 14);
    const messageId = `MSG${Date.now()}`;
    
    return `MSH|^~\\&|TELERADIOLOGY|FACILITY|EMR_SYSTEM|${mockReport.hospitalName.toUpperCase()}|${timestamp}||ORU^R01|${messageId}|P|2.3
PID|||${mockReport.mrn}||${mockReport.patientName.replace(' ', '^')}||19850615|M
PV1||O|RAD|||||||||||||||||||||||||||||||||||||||
OBR|1|${mockReport.accessionNo}|study_001|${mockReport.studyDescription}|||${timestamp}|||||||||||${mockReport.referringPhysician}
OBX|1|TX|FINDINGS|1|${mockReport.findings.substring(0, 200)}...||||||F
OBX|2|TX|IMPRESSION|1|${mockReport.impression}||||||F
OBX|3|TX|RECOMMENDATIONS|1|${mockReport.recommendations}||||||F`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
            <div className="text-white text-2xl">🔗</div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            HL7 Integration Workflow Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete report finalization and EMR/RIS transmission process
          </p>
        </div>

        {/* Workflow Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Progress</CardTitle>
            <CardDescription>
              Follow the complete process from report finalization to EMR delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center">
                <Button 
                  onClick={simulateHL7Workflow}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Start HL7 Workflow Demo'
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {steps.map((stepItem) => (
                  <div
                    key={stepItem.id}
                    className={`p-4 rounded-lg border text-center transition-all ${
                      step > stepItem.id 
                        ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                        : step === stepItem.id
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                        : 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800'
                    }`}
                  >
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-bold ${
                      step > stepItem.id 
                        ? 'bg-green-500 text-white' 
                        : step === stepItem.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step > stepItem.id ? '✓' : stepItem.id}
                    </div>
                    <h3 className="font-medium text-sm mb-1">{stepItem.title}</h3>
                    <p className="text-xs text-muted-foreground">{stepItem.description}</p>
                  </div>
                ))}
              </div>

              <Progress value={(step / steps.length) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Demo Content */}
        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="report">Sample Report</TabsTrigger>
            <TabsTrigger value="hl7">HL7 Message</TabsTrigger>
            <TabsTrigger value="results">Transmission Results</TabsTrigger>
            <TabsTrigger value="endpoints">HL7 Endpoints</TabsTrigger>
          </TabsList>

          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle>Structured Radiology Report</CardTitle>
                <CardDescription>
                  Example CT chest report that will be transmitted via HL7
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Patient Information</h4>
                      <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded text-sm space-y-1">
                        <div><span className="font-medium">Name:</span> {mockReport.patientName}</div>
                        <div><span className="font-medium">MRN:</span> {mockReport.mrn}</div>
                        <div><span className="font-medium">Accession:</span> {mockReport.accessionNo}</div>
                        <div><span className="font-medium">Study Date:</span> {mockReport.studyDate}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Study Information</h4>
                      <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded text-sm space-y-1">
                        <div><span className="font-medium">Description:</span> {mockReport.studyDescription}</div>
                        <div><span className="font-medium">Modality:</span> {mockReport.modality}</div>
                        <div><span className="font-medium">Hospital:</span> {mockReport.hospitalName}</div>
                        <div><span className="font-medium">Referring Dr:</span> {mockReport.referringPhysician}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Report Content</h4>
                      <div className="space-y-3">
                        <div>
                          <Badge variant="outline" className="mb-2">Findings</Badge>
                          <Textarea 
                            value={mockReport.findings}
                            readOnly
                            className="text-sm"
                            rows={4}
                          />
                        </div>
                        
                        <div>
                          <Badge variant="outline" className="mb-2">Impression</Badge>
                          <Textarea 
                            value={mockReport.impression}
                            readOnly
                            className="text-sm"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <Badge variant="outline" className="mb-2">Recommendations</Badge>
                          <Textarea 
                            value={mockReport.recommendations}
                            readOnly
                            className="text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hl7">
            <Card>
              <CardHeader>
                <CardTitle>Generated HL7 ORU^R01 Message</CardTitle>
                <CardDescription>
                  This message would be transmitted to the hospital EMR/RIS system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {generateHL7Message()}
                  </pre>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded">
                    <div className="font-medium text-blue-900 dark:text-blue-100">MSH Segment</div>
                    <div className="text-blue-700 dark:text-blue-300">Message header with routing info</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded">
                    <div className="font-medium text-green-900 dark:text-green-100">PID/PV1 Segments</div>
                    <div className="text-green-700 dark:text-green-300">Patient demographics and visit</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded">
                    <div className="font-medium text-purple-900 dark:text-purple-100">OBR/OBX Segments</div>
                    <div className="text-purple-700 dark:text-purple-300">Order and observation data</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Transmission Results</CardTitle>
                <CardDescription>
                  Real-time status of HL7 message delivery to EMR systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hl7Results ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500">Success</Badge>
                      <span className="text-sm">Message transmitted successfully</span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded">
                      <h4 className="font-medium mb-2">Transmission Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Message ID:</span> {hl7Results.data?.messageId}
                        </div>
                        <div>
                          <span className="font-medium">Endpoint:</span> {hl7Results.data?.endpoint}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {hl7Results.data?.transmission?.status}
                        </div>
                        <div>
                          <span className="font-medium">Sent At:</span> {new Date(hl7Results.data?.transmission?.sentAt || '').toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">EMR Response (MSA)</h4>
                      <code className="text-sm text-green-800 dark:text-green-200 font-mono">
                        {hl7Results.data?.transmission?.response}
                      </code>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="text-2xl mb-2">📤</div>
                    <p>Run the workflow demo to see transmission results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle>Configured HL7 Endpoints</CardTitle>
                <CardDescription>
                  EMR/RIS systems configured for automatic report delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">General Hospital EMR</h4>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Host:</span> emr.generalhospital.com
                      </div>
                      <div>
                        <span className="font-medium">Port:</span> 6661
                      </div>
                      <div>
                        <span className="font-medium">Protocol:</span> MLLP
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">City Medical Center RIS</h4>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Host:</span> ris.citymedical.org
                      </div>
                      <div>
                        <span className="font-medium">Port:</span> 443
                      </div>
                      <div>
                        <span className="font-medium">Protocol:</span> HTTPS
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-950">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-muted-foreground">Regional Medical PACS</h4>
                      <Badge variant="outline">Inactive</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Host:</span> pacs.regionalmed.net
                      </div>
                      <div>
                        <span className="font-medium">Port:</span> 6662
                      </div>
                      <div>
                        <span className="font-medium">Protocol:</span> MLLP
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🚀 Automatic Transmission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reports are automatically transmitted to configured EMR/RIS systems immediately upon finalization, 
                ensuring seamless integration with hospital workflows.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔄 Intelligent Retry</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Failed transmissions are automatically retried with exponential backoff, 
                ensuring reliable delivery even with temporary network issues.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 Complete Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time monitoring of all HL7 transmissions with detailed logging, 
                success rate tracking, and immediate alerts for failed deliveries.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Download Options */}
        <Card>
          <CardHeader>
            <CardTitle>Alternative Delivery Methods</CardTitle>
            <CardDescription>
              If HL7 transmission fails, reports can be manually downloaded and delivered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                📄 Download PDF Report
              </Button>
              <Button variant="outline">
                💾 Export HL7 Message
              </Button>
              <Button variant="outline">
                📧 Email to Referring Physician
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}