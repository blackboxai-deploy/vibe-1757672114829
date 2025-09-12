import { NextRequest, NextResponse } from 'next/server';

export interface FinalizeReportRequest {
  reportId: string;
  studyId: string;
  radiologistId: string;
  report: {
    findings: string;
    impression: string;
    recommendations: string;
    mrn: string;
    patientName: string;
    accessionNo: string;
    studyDescription: string;
    studyDate: string;
    modality: string;
    hospitalName: string;
    referringPhysician: string;
  };
  digitalSignature?: string;
  sendToHL7?: boolean;
  hl7EndpointIds?: string[];
}

export interface FinalizeReportResponse {
  success: boolean;
  data?: {
    reportId: string;
    pdfGenerated: boolean;
    pdfUrl?: string;
    hl7Results?: Array<{
      endpointId: string;
      endpointName: string;
      success: boolean;
      messageId?: string;
      error?: string;
      transmissionId?: string;
    }>;
    auditLogId: string;
  };
  error?: string;
}

// Mock HL7 endpoints for demonstration
const mockEndpoints = [
  {
    id: 'endpoint_1',
    name: 'General Hospital EMR',
    hospitalId: 'hospital_1',
    isActive: true
  },
  {
    id: 'endpoint_2',
    name: 'City Medical Center RIS',
    hospitalId: 'hospital_2',
    isActive: true
  }
];

// POST - Finalize report and send via HL7
export async function POST(request: NextRequest) {
  try {
    const body: FinalizeReportRequest = await request.json();
    const { reportId, studyId, radiologistId, report, digitalSignature, sendToHL7 = true, hl7EndpointIds } = body;

    if (!reportId || !studyId || !radiologistId || !report) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate report content
    if (!report.findings || !report.impression || !report.mrn || !report.patientName) {
      return NextResponse.json(
        { success: false, error: 'Report must include findings, impression, MRN, and patient name' },
        { status: 400 }
      );
    }

    // Generate PDF report
    const pdfResult = await generatePDFReport(reportId, report, digitalSignature);
    
    // Prepare HL7 transmission results
    const hl7Results: Array<{
      endpointId: string;
      endpointName: string;
      success: boolean;
      messageId?: string;
      error?: string;
      transmissionId?: string;
    }> = [];

    if (sendToHL7) {
      // Determine which endpoints to send to
      let targetEndpoints = mockEndpoints.filter(e => e.isActive);
      
      if (hl7EndpointIds && hl7EndpointIds.length > 0) {
        targetEndpoints = targetEndpoints.filter(e => hl7EndpointIds.includes(e.id));
      }

      // Send to each endpoint
      for (const endpoint of targetEndpoints) {
        try {
          const hl7Response = await fetch(`${request.url.replace('/reports/finalize', '/hl7')}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reportId,
              studyId,
              endpointId: endpoint.id,
              messageContent: report
            })
          });

          const hl7Data = await hl7Response.json();

          if (hl7Data.success) {
            hl7Results.push({
              endpointId: endpoint.id,
              endpointName: endpoint.name,
              success: true,
              messageId: hl7Data.data.messageId,
              transmissionId: hl7Data.data.transmission.id
            });
          } else {
            hl7Results.push({
              endpointId: endpoint.id,
              endpointName: endpoint.name,
              success: false,
              error: hl7Data.error || 'HL7 transmission failed'
            });
          }
        } catch (error) {
          hl7Results.push({
            endpointId: endpoint.id,
            endpointName: endpoint.name,
            success: false,
            error: `Connection error: ${error}`
          });
        }
      }
    }

    // Create audit log
    const auditLogId = `audit_${Date.now()}`;
    console.log('Audit Log:', {
      id: auditLogId,
      action: 'FINALIZE_REPORT',
      userId: radiologistId,
      reportId,
      studyId,
      timestamp: new Date().toISOString(),
      details: {
        pdfGenerated: pdfResult.success,
        hl7Sent: sendToHL7,
        hl7Results: hl7Results.length,
        successfulTransmissions: hl7Results.filter(r => r.success).length
      }
    });

    const response: FinalizeReportResponse = {
      success: true,
      data: {
        reportId,
        pdfGenerated: pdfResult.success,
        pdfUrl: pdfResult.url,
        hl7Results: sendToHL7 ? hl7Results : undefined,
        auditLogId
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error finalizing report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to finalize report' },
      { status: 500 }
    );
  }
}

// Helper function to generate PDF report
async function generatePDFReport(
  reportId: string, 
  report: FinalizeReportRequest['report'],
  digitalSignature?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Simulate PDF generation process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log report and signature for demonstration (would actually generate PDF)
    console.log('Generating PDF for report:', reportId, 'with content length:', report.findings.length);
    if (digitalSignature) {
      console.log('Digital signature applied:', digitalSignature.substring(0, 20) + '...');
    }

    const pdfUrl = `https://sb-3gcvqvn0ltio.vercel.run/api/reports/${reportId}/pdf`;
    
    return {
      success: true,
      url: pdfUrl
    };
  } catch (error) {
    return {
      success: false,
      error: `PDF generation failed: ${error}`
    };
  }
}

// GET - Retrieve report finalization status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json(
        { success: false, error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Mock finalization status
    const mockStatus = {
      reportId,
      status: 'finalized',
      finalizedAt: new Date().toISOString(),
      finalizedBy: 'Dr. Michael Chen',
      pdfGenerated: true,
      pdfUrl: `/api/reports/${reportId}/pdf`,
      hl7Transmissions: [
        {
          endpointId: 'endpoint_1',
          endpointName: 'General Hospital EMR',
          status: 'sent',
          messageId: 'MSG123456',
          sentAt: new Date().toISOString(),
          response: 'MSA|AA|MSG123456|Message accepted'
        }
      ],
      auditTrail: [
        {
          action: 'Report Created',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'Dr. Michael Chen'
        },
        {
          action: 'Report Finalized',
          timestamp: new Date().toISOString(),
          user: 'Dr. Michael Chen'
        },
        {
          action: 'HL7 Sent',
          timestamp: new Date().toISOString(),
          user: 'System'
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockStatus
    });

  } catch (error) {
    console.error('Error fetching report status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch report status' },
      { status: 500 }
    );
  }
}