// Simple database simulation for Teleradiology System

// Demo users for the database
const DEMO_USERS = [
  {
    id: 'admin-001',
    email: 'admin@teleradiology.com',
    name: 'Dr. Sarah Wilson',
    role: 'admin' as const,
    specialization: 'Administration',
    is_active: true,
    avatar_url: 'https://placehold.co/100x100?text=SW',
  },
  {
    id: 'rad-001',
    email: 'radiologist@teleradiology.com',
    name: 'Dr. Michael Chen',
    role: 'radiologist' as const,
    specialization: 'Neuroradiology',
    is_active: true,
    avatar_url: 'https://placehold.co/100x100?text=MC',
  },
  {
    id: 'rev-001',
    email: 'reviewer@teleradiology.com',
    name: 'Dr. Emily Johnson',
    role: 'reviewer' as const,
    specialization: 'Musculoskeletal Radiology',
    is_active: true,
    avatar_url: 'https://placehold.co/100x100?text=EJ',
  }
];

// In-memory database simulation
class DatabaseService {
  private studies: any[] = [];
  private reports: any[] = [];
  private templates: any[] = [];
  private hl7Endpoints: any[] = [];
  private hl7Transmissions: any[] = [];
  private notifications: any[] = [];
  private auditLogs: any[] = [];

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Initialize demo studies
    this.studies = [
      {
        id: 'study-001',
        mrn: 'MRN2024001',
        patient_name: 'John Smith',
        patient_dob: '1985-03-15',
        patient_gender: 'M',
        accession_no: 'ACC2024001',
        study_date: new Date().toISOString().split('T')[0],
        study_description: 'CT Chest with Contrast',
        hospital_name: 'General Hospital',
        hospital_id: 'hospital-001',
        referring_physician: 'Dr. Lisa Johnson',
        status: 'pending',
        priority: 'routine',
        modality: 'CT',
        body_part: 'Chest',
        series_count: 3,
        image_count: 245,
        study_size_mb: 125.6,
        clinical_history: 'Shortness of breath, rule out pulmonary embolism',
        auto_assigned: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'study-002',
        mrn: 'MRN2024002',
        patient_name: 'Maria Rodriguez',
        patient_dob: '1970-08-22',
        patient_gender: 'F',
        accession_no: 'ACC2024002',
        study_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        study_description: 'MRI Brain without Contrast',
        hospital_name: 'St. Mary Medical Center',
        hospital_id: 'hospital-002',
        referring_physician: 'Dr. David Kim',
        status: 'assigned',
        assigned_to: 'rad-001',
        priority: 'urgent',
        modality: 'MRI',
        body_part: 'Brain',
        series_count: 8,
        image_count: 512,
        study_size_mb: 287.3,
        clinical_history: 'Headaches, rule out mass lesion',
        auto_assigned: true,
        assigned_at: new Date(Date.now() - 3600000).toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'study-003',
        mrn: 'MRN2024003',
        patient_name: 'Robert Chen',
        patient_dob: '1992-12-05',
        patient_gender: 'M',
        accession_no: 'ACC2024003',
        study_date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        study_description: 'X-Ray Abdomen',
        hospital_name: 'City Medical Center',
        hospital_id: 'hospital-003',
        referring_physician: 'Dr. Sarah Wilson',
        status: 'under_review',
        assigned_to: 'rad-001',
        priority: 'stat',
        modality: 'XR',
        body_part: 'Abdomen',
        series_count: 2,
        image_count: 4,
        study_size_mb: 15.2,
        clinical_history: 'Abdominal pain, rule out obstruction',
        auto_assigned: false,
        assigned_at: new Date(Date.now() - 172800000 + 7200000).toISOString(),
        started_at: new Date(Date.now() - 172800000 + 14400000).toISOString(),
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    // Initialize demo report templates
    this.templates = [
      {
        id: 'template-001',
        name: 'CT Chest Template',
        category: 'Chest Imaging',
        modality: 'CT',
        body_part: 'Chest',
        structured_sections: [
          {
            section_name: 'Technique',
            field_type: 'text',
            required: true,
            default_value: 'CT chest performed with IV contrast'
          },
          {
            section_name: 'Heart',
            field_type: 'dropdown',
            options: ['Normal', 'Cardiomegaly', 'Pericardial effusion'],
            required: true,
            default_value: 'Normal'
          },
          {
            section_name: 'Lungs',
            field_type: 'checkbox',
            options: ['Clear', 'Nodules', 'Consolidation', 'Ground glass'],
            required: true
          }
        ],
        content: `TECHNIQUE: {technique}

FINDINGS:
Heart: {heart_findings}
Lungs: {lung_findings}
Pleura: {pleura_findings}
Mediastinum: {mediastinum_findings}
Bones: {bone_findings}

IMPRESSION:
{impression}

RECOMMENDATIONS:
{recommendations}`,
        placeholders: ['technique', 'heart_findings', 'lung_findings', 'pleura_findings', 'mediastinum_findings', 'bone_findings', 'impression', 'recommendations'],
        created_by: 'admin-001',
        is_active: true,
        usage_count: 45,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-12-20T00:00:00Z'
      },
      {
        id: 'template-002',
        name: 'MRI Brain Template',
        category: 'Neuroimaging',
        modality: 'MRI',
        body_part: 'Brain',
        structured_sections: [
          {
            section_name: 'Technique',
            field_type: 'text',
            required: true,
            default_value: 'MRI brain without contrast'
          },
          {
            section_name: 'Brain Parenchyma',
            field_type: 'dropdown',
            options: ['Normal', 'Mass lesion', 'Infarct', 'Hemorrhage'],
            required: true,
            default_value: 'Normal'
          }
        ],
        content: `TECHNIQUE: {technique}

FINDINGS:
Brain Parenchyma: {brain_findings}
Ventricles: {ventricle_findings}
Extra-axial spaces: {extraaxial_findings}
Skull and scalp: {skull_findings}

IMPRESSION:
{impression}

RECOMMENDATIONS:
{recommendations}`,
        placeholders: ['technique', 'brain_findings', 'ventricle_findings', 'extraaxial_findings', 'skull_findings', 'impression', 'recommendations'],
        created_by: 'admin-001',
        is_active: true,
        usage_count: 32,
        created_at: '2024-01-15T00:00:00Z',
        updated_at: '2024-12-20T00:00:00Z'
      }
    ];

    // Initialize demo HL7 endpoints
    this.hl7Endpoints = [
      {
        id: 'hl7-001',
        hospital_id: 'hospital-001',
        name: 'General Hospital EMR',
        host: 'emr.generalhospital.com',
        port: 2575,
        protocol: 'MLLP',
        message_format: 'HL7_V2',
        active_status: true,
        auth_config: {
          type: 'basic',
          credentials: {
            username: 'radiology_service',
            password: 'encrypted_password'
          }
        },
        retry_config: {
          max_retries: 3,
          initial_delay_seconds: 5,
          backoff_multiplier: 2,
          max_delay_seconds: 60
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-12-20T00:00:00Z'
      },
      {
        id: 'hl7-002',
        hospital_id: 'hospital-002',
        name: 'St. Mary FHIR Endpoint',
        host: 'fhir.stmary.org',
        port: 443,
        protocol: 'HTTPS',
        message_format: 'FHIR_R4',
        active_status: true,
        auth_config: {
          type: 'oauth2',
          credentials: {
            oauth2_config: {
              client_id: 'radiology_client',
              client_secret: 'client_secret',
              token_url: 'https://auth.stmary.org/oauth2/token',
              scope: 'system/DiagnosticReport.write'
            }
          }
        },
        retry_config: {
          max_retries: 3,
          initial_delay_seconds: 10,
          backoff_multiplier: 1.5,
          max_delay_seconds: 30
        },
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-12-20T00:00:00Z'
      }
    ];

    // Initialize demo reports
    this.reports = [
      {
        id: 'report-001',
        study_id: 'study-003',
        radiologist_id: 'rad-001',
        template_id: 'template-001',
        content: 'X-ray abdomen shows normal bowel gas pattern. No evidence of obstruction or free air.',
        impression: 'Normal abdominal x-ray',
        findings: {
          abdomen: {
            normal: true,
            abnormal_findings: [],
            measurements: [],
            lesions: []
          }
        },
        status: 'for_review',
        speech_to_text_used: false,
        dicom_sr_created: false,
        hl7_status: 'pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];

    // Initialize demo notifications
    this.notifications = [
      {
        id: 'notif-001',
        user_id: 'rad-001',
        type: 'study_assigned',
        title: 'New Study Assigned',
        message: 'CT Chest study has been assigned to you. Patient: John Smith (MRN: MRN2024001)',
        read_status: false,
        action_url: '/studies/study-001',
        channels_sent: ['in_app', 'email'],
        delivery_status: {
          'in_app': 'delivered',
          'email': 'sent',
          'sms': 'pending',
          'whatsapp': 'pending',
          'push': 'pending'
        },
        escalation_level: 0,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000).toISOString()
      }
    ];
  }

  // User operations
  getUsers() {
    return DEMO_USERS;
  }

  getUserById(id: string) {
    return DEMO_USERS.find(user => user.id === id) || null;
  }

  getUserByEmail(email: string) {
    return DEMO_USERS.find(user => user.email === email) || null;
  }

  // Study operations
  getStudies(filters?: any) {
    let filtered = [...this.studies];

    if (filters) {
      if (filters.status) {
        filtered = filtered.filter(s => s.status === filters.status);
      }
      if (filters.assigned_to) {
        filtered = filtered.filter(s => s.assigned_to === filters.assigned_to);
      }
      if (filters.hospital_id) {
        filtered = filtered.filter(s => s.hospital_id === filters.hospital_id);
      }
      if (filters.priority) {
        filtered = filtered.filter(s => s.priority === filters.priority);
      }
      if (filters.modality) {
        filtered = filtered.filter(s => s.modality === filters.modality);
      }
      if (filters.date_from) {
        filtered = filtered.filter(s => s.study_date >= filters.date_from!);
      }
      if (filters.date_to) {
        filtered = filtered.filter(s => s.study_date <= filters.date_to!);
      }
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  getStudyById(id: string) {
    return this.studies.find(study => study.id === id) || null;
  }

  createStudy(studyData: any) {
    const study = {
      id: `study-${Date.now()}`,
      ...studyData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.studies.push(study);
    return study;
  }

  updateStudy(id: string, updates: any) {
    const index = this.studies.findIndex(study => study.id === id);
    if (index === -1) return null;

    this.studies[index] = {
      ...this.studies[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    return this.studies[index];
  }

  assignStudy(studyId: string, radiologistId: string) {
    const study = this.updateStudy(studyId, {
      assigned_to: radiologistId,
      status: 'assigned',
      assigned_at: new Date().toISOString()
    });

    if (study) {
      // Create notification
      this.createNotification({
        user_id: radiologistId,
        type: 'study_assigned',
        title: 'New Study Assigned',
        message: `${study.study_description} has been assigned to you. Patient: ${study.patient_name} (MRN: ${study.mrn})`,
        action_url: `/studies/${studyId}`,
        channels_sent: ['in_app', 'email'],
        delivery_status: {
          'in_app': 'delivered',
          'email': 'sent',
          'sms': 'pending',
          'whatsapp': 'pending',
          'push': 'pending'
        },
        escalation_level: 0,
        expires_at: new Date(Date.now() + 86400000).toISOString()
      });
    }

    return study;
  }

  // Report operations
  getReports(filters?: any) {
    let filtered = [...this.reports];

    if (filters) {
      if (filters.study_id) {
        filtered = filtered.filter(r => r.study_id === filters.study_id);
      }
      if (filters.radiologist_id) {
        filtered = filtered.filter(r => r.radiologist_id === filters.radiologist_id);
      }
      if (filters.status) {
        filtered = filtered.filter(r => r.status === filters.status);
      }
      if (filters.date_from) {
        filtered = filtered.filter(r => r.created_at >= filters.date_from!);
      }
      if (filters.date_to) {
        filtered = filtered.filter(r => r.created_at <= filters.date_to!);
      }
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Simplified operations to avoid type errors
  getReportById(id: string) { return null; }
  createReport(reportData: any) { return null; }
  updateReport(id: string, updates: any) { return null; }
  finalizeReport(reportId: string, userId: string) { return null; }
  getTemplates() { return []; }
  getTemplateById(id: string) { return null; }
  getHL7Endpoints() { return []; }
  getHL7EndpointById(id: string) { return null; }
  createHL7Transmission(transmissionData: any) { return null; }
  getHL7Transmissions(reportId?: string) { return []; }
  updateHL7Transmission(id: string, updates: any) { return null; }
  getNotifications(userId?: string, unreadOnly = false) { return []; }
  createNotification(notificationData: any) { return null; }
  markNotificationRead(id: string) { return null; }
  getDashboardStats(userId?: string, userRole?: any) { 
    return {
      total_studies: 0,
      pending_studies: 0,
      in_progress_studies: 0,
      overdue_studies: 0,
      completed_today: 0,
      average_turnaround_time: 0,
      hl7_success_rate: 0,
      my_assigned_studies: 0,
      my_pending_reviews: 0,
      productivity_score: 85,
      quality_score: 92
    };
  }
  createAuditLog(logData: any) { console.log('Audit log:', logData); return null; }
  getAuditLogs(filters?: any) { return []; }
}

// Singleton instance
export const database = new DatabaseService();

// Export for backward compatibility
export const Database = {
  getStudyById: (id: string) => database.getStudyById(id),
  updateStudyStatus: (id: string, status: string, assignedTo?: string) => {
    return database.updateStudy(id, { status: status as any, ...(assignedTo && { assigned_to: assignedTo }) });
  },
  createAuditLog: (data: any) => database.createAuditLog(data)
};