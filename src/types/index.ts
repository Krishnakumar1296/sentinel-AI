// ─── User & Auth ──────────────────────────────────────────
export type UserRole = 'employee' | 'manager' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  department: string
  role: UserRole
  avatar?: string
  status: 'active' | 'inactive'
  lastActive: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// ─── Documents ────────────────────────────────────────────
export type DocumentStatus = 'active' | 'restricted' | 'processing' | 'failed'
export type DocumentAccess = 'employee' | 'manager' | 'admin' | 'finance' | 'hr' | 'it'

export interface Document {
  id: string
  name: string
  department: string
  type: 'PDF'
  access: DocumentAccess
  status: DocumentStatus
  pages: number
  size: string
  uploadedBy: string
  updatedAt: string
  description?: string
  indexed: boolean
}

// ─── Search & AI ──────────────────────────────────────────
export interface SearchSource {
  id: string
  documentId: string
  documentName: string
  page: number
  totalPages: number
  relevance: number
  excerpt: string
}

export interface SearchResult {
  id: string
  query: string
  answer: string
  confidence: number
  sources: SearchSource[]
  timestamp: string
  status: 'verified' | 'no_answer' | 'partial'
  responseTime: number
}

export interface SearchHistoryItem {
  id: string
  query: string
  timestamp: string
  status: 'verified' | 'no_answer' | 'partial'
  confidence: number
  sourcesCount: number
  responseTime: number
}

// ─── Knowledge Gaps ───────────────────────────────────────
export type GapPriority = 'high' | 'medium' | 'low'

export interface KnowledgeGap {
  id: string
  question: string
  frequency: number
  priority: GapPriority
  department: string
  firstSeen: string
  lastSeen: string
  status: 'open' | 'in_progress' | 'resolved'
}

// ─── Analytics ────────────────────────────────────────────
export interface AnalyticsData {
  totalQueries: number
  successfulAnswers: number
  failedQueries: number
  avgResponseTime: number
  faithfulnessScore: number
  contextRelevance: number
  answerConfidence: number
  retrievalPrecision: number
  queryTrend: Array<{ date: string; queries: number; successful: number }>
  topDepartments: Array<{ name: string; queries: number }>
  gapsByDepartment: Array<{ department: string; count: number }>
}

// ─── Security ─────────────────────────────────────────────
export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resource: string
  status: 'success' | 'blocked' | 'failed'
  details: string
}

// ─── Notifications ────────────────────────────────────────
export type NotificationType = 'success' | 'warning' | 'error' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
}
