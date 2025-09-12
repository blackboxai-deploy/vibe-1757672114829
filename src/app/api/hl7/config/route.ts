import { NextRequest, NextResponse } from 'next/server';

export interface HL7EndpointConfig {
  id: string;
  hospitalId: string;
  hospitalName: string;
  name: string;
  host: string;
  port: number;
  protocol: 'MLLP' | 'HTTPS';
  isActive: boolean;
  authConfig?: {
    type: 'basic' | 'token' | 'certificate';
    credentials: Record<string, string>;
  };
  testConnection?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock endpoints configuration
let mockEndpointsConfig: HL7EndpointConfig[] = [
  {
    id: 'endpoint_1',
    hospitalId: 'hospital_1',
    hospitalName: 'General Hospital',
    name: 'General Hospital EMR System',
    host: 'emr.generalhospital.com',
    port: 6661,
    protocol: 'MLLP',
    isActive: true,
    authConfig: {
      type: 'basic',
      credentials: { username: 'teleradiology', password: '***hidden***' }
    },
    testConnection: true,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-20T08:00:00Z'
  },
  {
    id: 'endpoint_2',
    hospitalId: 'hospital_2',
    hospitalName: 'City Medical Center',
    name: 'City Medical RIS Integration',
    host: 'ris.citymedical.org',
    port: 443,
    protocol: 'HTTPS',
    isActive: true,
    authConfig: {
      type: 'token',
      credentials: { token: '***hidden***' }
    },
    testConnection: true,
    createdAt: '2024-11-15T14:30:00Z',
    updatedAt: '2024-12-18T16:45:00Z'
  },
  {
    id: 'endpoint_3',
    hospitalId: 'hospital_3',
    hospitalName: 'Regional Medical',
    name: 'Regional Medical PACS',
    host: 'pacs.regionalmed.net',
    port: 6662,
    protocol: 'MLLP',
    isActive: false,
    authConfig: {
      type: 'certificate',
      credentials: { certificate: '***hidden***', privateKey: '***hidden***' }
    },
    testConnection: false,
    createdAt: '2024-10-20T09:15:00Z',
    updatedAt: '2024-12-10T11:20:00Z'
  }
];

// GET - Retrieve HL7 endpoint configurations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hospitalId = searchParams.get('hospitalId');
    const isActive = searchParams.get('isActive');

    let filteredEndpoints = [...mockEndpointsConfig];

    if (hospitalId) {
      filteredEndpoints = filteredEndpoints.filter(e => e.hospitalId === hospitalId);
    }

    if (isActive !== null) {
      const activeFilter = isActive === 'true';
      filteredEndpoints = filteredEndpoints.filter(e => e.isActive === activeFilter);
    }

    return NextResponse.json({
      success: true,
      data: {
        endpoints: filteredEndpoints,
        total: filteredEndpoints.length,
        active: filteredEndpoints.filter(e => e.isActive).length,
        inactive: filteredEndpoints.filter(e => !e.isActive).length
      }
    });

  } catch (error) {
    console.error('Error fetching HL7 configurations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch HL7 configurations' },
      { status: 500 }
    );
  }
}

// POST - Create new HL7 endpoint configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hospitalId, hospitalName, name, host, port, protocol, authConfig, isActive = true } = body;

    if (!hospitalId || !hospitalName || !name || !host || !port || !protocol) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate protocol
    if (!['MLLP', 'HTTPS'].includes(protocol)) {
      return NextResponse.json(
        { success: false, error: 'Protocol must be MLLP or HTTPS' },
        { status: 400 }
      );
    }

    // Validate port
    if (port < 1 || port > 65535) {
      return NextResponse.json(
        { success: false, error: 'Port must be between 1 and 65535' },
        { status: 400 }
      );
    }

    const newEndpoint: HL7EndpointConfig = {
      id: `endpoint_${Date.now()}`,
      hospitalId,
      hospitalName,
      name,
      host,
      port,
      protocol,
      isActive,
      authConfig,
      testConnection: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockEndpointsConfig.push(newEndpoint);

    return NextResponse.json({
      success: true,
      data: newEndpoint,
      message: 'HL7 endpoint configuration created successfully'
    });

  } catch (error) {
    console.error('Error creating HL7 configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create HL7 configuration' },
      { status: 500 }
    );
  }
}

// PUT - Update existing HL7 endpoint configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Endpoint ID is required' },
        { status: 400 }
      );
    }

    const endpointIndex = mockEndpointsConfig.findIndex(e => e.id === id);
    
    if (endpointIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Endpoint not found' },
        { status: 404 }
      );
    }

    // Validate protocol if provided
    if (updates.protocol && !['MLLP', 'HTTPS'].includes(updates.protocol)) {
      return NextResponse.json(
        { success: false, error: 'Protocol must be MLLP or HTTPS' },
        { status: 400 }
      );
    }

    // Validate port if provided
    if (updates.port && (updates.port < 1 || updates.port > 65535)) {
      return NextResponse.json(
        { success: false, error: 'Port must be between 1 and 65535' },
        { status: 400 }
      );
    }

    const updatedEndpoint = {
      ...mockEndpointsConfig[endpointIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    mockEndpointsConfig[endpointIndex] = updatedEndpoint;

    return NextResponse.json({
      success: true,
      data: updatedEndpoint,
      message: 'HL7 endpoint configuration updated successfully'
    });

  } catch (error) {
    console.error('Error updating HL7 configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update HL7 configuration' },
      { status: 500 }
    );
  }
}

// DELETE - Remove HL7 endpoint configuration
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Endpoint ID is required' },
        { status: 400 }
      );
    }

    const endpointIndex = mockEndpointsConfig.findIndex(e => e.id === id);
    
    if (endpointIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Endpoint not found' },
        { status: 404 }
      );
    }

    const deletedEndpoint = mockEndpointsConfig.splice(endpointIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedEndpoint,
      message: 'HL7 endpoint configuration deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting HL7 configuration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete HL7 configuration' },
      { status: 500 }
    );
  }
}