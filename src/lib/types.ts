// Database Types for Teleradiology System

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  specialization?: string;
  active_status: boolean;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  ADMIN = 'admin',
  RADIOLOGIST = 'radiologist',
  REVIEWER = 'reviewer'
}

export interface Study {
  id: string;
  mrn: string;
  patient_name: string;
  accession_no: string;
  study_date: string;
  study_description: string;
  hospital_name: string;
  referring_physician: string;
  status: StudyStatus;
  assigned_to?: string;
  priority: StudyPriority;
  modality: string;
  body_part: string;
  created_at: string;
  updated_at: string;
}

export enum StudyStatus {
  PENDING = 'pending',           // Red - New study, not assigned
  ASSIGNED = 'assigned',         // Red - Assigned but not started
  IN_PROGRESS = 'in_progress',   // Yellow - Draft report in progress
  UNDER_REVIEW = 'under_review', // Yellow - Completed, pending review
  FINALIZED = 'finalized',       // Green - Report finalized
  HL7_SENT = 'hl7_sent'         // Green - HL7 message transmitted
}

export enum StudyPriority {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  STAT = 'stat',
  CRITICAL = 'critical'
}

export interface Report {
  id: string;
  study_id: string;
  radiologist_id: string;
  reviewer_id?: string;
  template_id?: string;
  content: string;
  impression: string;
  status: ReportStatus;
  digital_signature?: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  finalized_at?: string;
  hl7_sent_at?: string;
  hl7_status: HL7Status;
}

export enum ReportStatus {
  DRAFT = 'draft',
  FOR_REVIEW = 'for_review',
  APPROVED = 'approved',
  FINALIZED = 'finalized'
}

export enum HL7Status {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETRY = 'retry'
}

export interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  placeholders: string[];
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HL7Endpoint {
  id: string;
  hospital_id: string;
  name: string;
  host: string;
  port: number;
  protocol: HL7Protocol;
  active_status: boolean;
  auth_config?: HL7AuthConfig;
  created_at: string;
  updated_at: string;
}

export enum HL7Protocol {
  MLLP = 'mllp',
  HTTP = 'http',
  HTTPS = 'https'
}

export interface HL7AuthConfig {
  type: 'basic' | 'token' | 'certificate';
  credentials?: {
    username?: string;
    password?: string;
    token?: string;
    certificate_path?: string;
  };
}

export interface HL7Transmission {
  id: string;
  report_id: string;
  endpoint_id: string;
  message_id: string;
  hl7_message: string;
  status: HL7TransmissionStatus;
  sent_at?: string;
  delivered_at?: string;
  response?: string;
  error_message?: string;
  retry_count: number;
  max_retries: number;
  next_retry_at?: string;
}

export enum HL7TransmissionStatus {
  QUEUED = 'queued',
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read_status: boolean;
  action_url?: string;
  created_at: string;
  expires_at?: string;
}

export enum NotificationType {
  STUDY_ASSIGNED = 'study_assigned',
  REPORT_READY_FOR_REVIEW = 'report_ready_for_review',
  REPORT_APPROVED = 'report_approved',
  REPORT_REJECTED = 'report_rejected',
  HL7_SUCCESS = 'hl7_success',
  HL7_FAILED = 'hl7_failed',
  SYSTEM_ALERT = 'system_alert'
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: AuditAction;
  resource_type: string;
  resource_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  VIEW_STUDY = 'view_study',
  CREATE_REPORT = 'create_report',
  UPDATE_REPORT = 'update_report',
  FINALIZE_REPORT = 'finalize_report',
  SEND_HL7 = 'send_hl7',
  DOWNLOAD_PDF = 'download_pdf',
  ASSIGN_STUDY = 'assign_study',
  CONFIG_HL7 = 'config_hl7'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Dashboard Analytics Types
export interface DashboardStats {
  total_studies: number;
  pending_studies: number;
  in_progress_studies: number;
  completed_today: number;
  average_turnaround_time: number;
  hl7_success_rate: number;
  my_assigned_studies: number;
  my_pending_reviews: number;
}

// HL7 Message Structure
export interface HL7Message {
  msh: HL7_MSH;
  pid: HL7_PID;
  pv1: HL7_PV1;
  obr: HL7_OBR;
  obx: HL7_OBX[];
}

export interface HL7_MSH {
  field_separator: string;
  encoding_characters: string;
  sending_application: string;
  sending_facility: string;
  receiving_application: string;
  receiving_facility: string;
  timestamp: string;
  message_type: string;
  message_control_id: string;
  processing_id: string;
  version_id: string;
}

export interface HL7_PID {
  patient_id: string;
  patient_name: string;
  date_of_birth?: string;
  gender?: string;
  race?: string;
  address?: string;
  phone?: string;
}

export interface HL7_PV1 {
  visit_type: string;
  patient_location: string;
  attending_doctor?: string;
  referring_doctor?: string;
  visit_number?: string;
}

export interface HL7_OBR {
  set_id: string;
  placer_order_number: string;
  filler_order_number: string;
  universal_service_id: string;
  observation_date_time: string;
  requested_date_time?: string;
  observation_end_date_time?: string;
  collection_volume?: string;
  collector_identifier?: string;
  specimen_action_code?: string;
  ordering_provider: string;
}

export interface HL7_OBX {
  set_id: string;
  value_type: string;
  observation_identifier: string;
  observation_sub_id: string;
  observation_value: string;
  units?: string;
  references_range?: string;
  abnormal_flags?: string;
  probability?: string;
  nature_of_abnormal_test?: string;
  observation_result_status: string;
  effective_date?: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  specialization?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}