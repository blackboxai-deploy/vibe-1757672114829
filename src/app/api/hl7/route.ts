import { NextRequest, NextResponse } from 'next/server';

export interface HL7Message {
  id: string;
  reportId: string;
  studyId: string;
  messageType: 'ORU^R01';
  content: string;
  status: 'pending' | 'sent' | 'failed' | 'retry';
  endpointId: string;
  createdAt: string;
  sentAt?: string;
  response?: string;
  retryCount: number;
}

export interface HL7Endpoint {
  id: string;
  hospitalId: string;
  name: string;
  host: string;
  port: number;
  protocol: 'MLLP' | 'HTTPS';
  isActive: boolean;
  authConfig?: {
    type: 'basic' | 'token' | 'certificate';
    credentials: Record<string, string>;
  };
}

// Mock data for demonstration
const mockEndpoints: HL7Endpoint[] = [
  {
    id: 'endpoint_1',
    hospitalId: 'hospital_1',
    name: 'General Hospital EMR',
    host: 'emr.generalhospital.com',
    port: 6661,
    protocol: 'MLLP',
    isActive: true,
    authConfig: {
      type: 'basic',
      credentials: { username: 'teleradiology', password: 'secure_key' }
    }
  },
  {
    id: 'endpoint_2',
    hospitalId: 'hospital_2',
    name: 'City Medical Center RIS',
    host: 'ris.citymedical.org',
    port: 443,
    protocol: 'HTTPS',
    isActive: true,
    authConfig: {
      type: 'token',
      credentials: { token: 'bearer_token_xyz' }
    }
  }
];

const mockTransmissions: HL7Message[] = [
  {
    id: 'msg_1',
    reportId: 'RPT001',
    studyId: '3',
    messageType: 'ORU^R01',
    content: 'MSH|^~\\&|TELERADIOLOGY|FACILITY|EMR_SYSTEM|HOSPITAL|20241220120000||ORU^R01|MSG123|P|2.3\rPID|||MRN001236||Johnson^Robert||19850615|M\rPV1||O|RAD\rOBR|1|ACC001236|STU001236|X-Ray Knee AP/LAT|||20241219154500\rOBX|1|TX|IMPRESSION|1|Normal bilateral knee X-ray. No acute fracture or dislocation identified.||||||F',
    status: 'sent',
    endpointId: 'endpoint_1',
    createdAt: '2024-12-19T15:50:00Z',
    sentAt: '2024-12-19T15:50:30Z',
    response: 'MSA|AA|MSG123|Message accepted',
    retryCount: 0
  },
  {
    id: 'msg_2',
    reportId: 'RPT002',
    studyId: '5',
    messageType: 'ORU^R01',
    content: 'MSH|^~\\&|TELERADIOLOGY|FACILITY|EMR_SYSTEM|HOSPITAL|20241218090000||ORU^R01|MSG124|P|2.3\rPID|||MRN001238||Brown^Michael||19780422|M\rPV1||I|RAD\rOBR|1|ACC001238|STU001238|CT Abdomen/Pelvis with Contrast|||20241218090000\rOBX|1|TX|IMPRESSION|1|Mild hepatic steatosis. No focal liver lesions. Normal pancreas and spleen.||||||F',
    status: 'sent',
    endpointId: 'endpoint_2',
    createdAt: '2024-12-18T09:15:00Z',
    sentAt: '2024-12-18T09:15:45Z',
    response: 'MSA|AA|MSG124|Report received successfully',
    retryCount: 0
  }
];

// GET - Retrieve HL7 transmissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');
    const studyId = searchParams.get('studyId');
    const status = searchParams.get('status');

    let filteredTransmissions = [...mockTransmissions];

    if (reportId) {
      filteredTransmissions = filteredTransmissions.filter(t => t.reportId === reportId);
    }

    if (studyId) {
      filteredTransmissions = filteredTransmissions.filter(t => t.studyId === studyId);
    }

    if (status) {
      filteredTransmissions = filteredTransmissions.filter(t => t.status === status);
    }

    return NextResponse.json({
      success: true,
      data: {
        transmissions: filteredTransmissions,
        endpoints: mockEndpoints
      }
    });

  } catch (error) {
    console.error('Error fetching HL7 data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch HL7 data' },
      { status: 500 }
    );
  }
}

// POST - Send HL7 message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, studyId, endpointId, messageContent } = body;

    if (!reportId || !studyId || !endpointId || !messageContent) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the endpoint
    const endpoint = mockEndpoints.find(e => e.id === endpointId);
    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'Endpoint not found' },
        { status: 404 }
      );
    }

    if (!endpoint.isActive) {
      return NextResponse.json(
        { success: false, error: 'Endpoint is not active' },
        { status: 400 }
      );
    }

    // Generate HL7 ORU message
    const messageId = `MSG_${Date.now()}`;
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 14);
    
    const hl7Message = generateORUMessage({
      messageId,
      timestamp,
      reportContent: messageContent,
      studyId
    });

    // Simulate HL7 transmission
    const transmission: HL7Message = {
      id: `msg_${Date.now()}`,
      reportId,
      studyId,
      messageType: 'ORU^R01',
      content: hl7Message,
      status: 'pending',
      endpointId,
      createdAt: new Date().toISOString(),
      retryCount: 0
    };

    // Simulate transmission delay and result
    const transmissionSuccess = Math.random() > 0.1; // 90% success rate for demo
    
    if (transmissionSuccess) {
      transmission.status = 'sent';
      transmission.sentAt = new Date().toISOString();
      transmission.response = `MSA|AA|${messageId}|Message accepted successfully`;
    } else {
      transmission.status = 'failed';
      transmission.response = `MSA|AR|${messageId}|Connection timeout - retry scheduled`;
    }

    mockTransmissions.unshift(transmission);

    return NextResponse.json({
      success: true,
      data: {
        transmission,
        endpoint: endpoint.name,
        messageId
      }
    });

  } catch (error) {
    console.error('Error sending HL7 message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send HL7 message' },
      { status: 500 }
    );
  }
}

// Helper function to generate HL7 ORU message
function generateORUMessage({
  messageId,
  timestamp,
  reportContent,
  studyId
}: {
  messageId: string;
  timestamp: string;
  reportContent: any;
  studyId: string;
}): string {
  const msh = `MSH|^~\\&|TELERADIOLOGY|FACILITY|EMR_SYSTEM|HOSPITAL|${timestamp}||ORU^R01|${messageId}|P|2.3`;
  const pid = `PID|||${reportContent.mrn || 'UNK'}||${reportContent.patientName || 'Unknown^Patient'}||${reportContent.dob || ''}|${reportContent.gender || 'U'}`;
  const pv1 = `PV1||${reportContent.patientType || 'O'}|${reportContent.department || 'RAD'}`;
  const obr = `OBR|1|${reportContent.accessionNo || studyId}|${studyId}|${reportContent.studyDescription || 'Unknown Study'}|||${reportContent.studyDateTime || timestamp}`;
  
  // Create OBX segments for report sections
  const obxSegments = [];
  let segmentIndex = 1;

  if (reportContent.findings) {
    obxSegments.push(`OBX|${segmentIndex}|TX|FINDINGS|1|${reportContent.findings.replace(/\r?\n/g, ' ')}||||||F`);
    segmentIndex++;
  }

  if (reportContent.impression) {
    obxSegments.push(`OBX|${segmentIndex}|TX|IMPRESSION|1|${reportContent.impression.replace(/\r?\n/g, ' ')}||||||F`);
    segmentIndex++;
  }

  if (reportContent.recommendations) {
    obxSegments.push(`OBX|${segmentIndex}|TX|RECOMMENDATIONS|1|${reportContent.recommendations.replace(/\r?\n/g, ' ')}||||||F`);
    segmentIndex++;
  }

  // Combine all segments
  const segments = [msh, pid, pv1, obr, ...obxSegments];
  return segments.join('\r');
}