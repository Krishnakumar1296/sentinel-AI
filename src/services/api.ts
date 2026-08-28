import type { User, SearchResult, Document, SearchHistoryItem, KnowledgeGap, AnalyticsData, AuditLogEntry, Notification } from '../types'
import {
  MOCK_USERS, MOCK_DOCUMENTS, MOCK_SEARCH_RESULTS,
  MOCK_HISTORY, MOCK_KNOWLEDGE_GAPS, MOCK_ANALYTICS,
  MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS,
} from './mockData'

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

// ─── Auth ─────────────────────────────────────────────────
export async function loginUser(email: string, _password: string): Promise<User | null> {
  await delay(800)
  const user = MOCK_USERS.find(u => u.email === email)
  return user ?? null
}

export async function logoutUser(): Promise<void> {
  await delay(200)
}

export async function getCurrentUser(id: string): Promise<User | null> {
  await delay(100)
  return MOCK_USERS.find(u => u.id === id) ?? null
}

// ─── Knowledge Search ─────────────────────────────────────
export async function searchKnowledge(query: string): Promise<SearchResult> {
  await delay(2200)
  // Return mock or generate no-answer
  const existing = MOCK_SEARCH_RESULTS[0]
  const lowerQuery = query.toLowerCase()
  const hasAnswer = lowerQuery.includes('remote') || lowerQuery.includes('leave') ||
    lowerQuery.includes('policy') || lowerQuery.includes('handbook') || lowerQuery.includes('data')

  if (!hasAnswer) {
    return {
      id: Date.now().toString(),
      query,
      answer: '',
      confidence: 0,
      sources: [],
      timestamp: new Date().toLocaleString(),
      status: 'no_answer',
      responseTime: 2.1,
    }
  }

  return {
    ...existing,
    id: Date.now().toString(),
    query,
    timestamp: 'Just now',
  }
}

// ─── Documents ────────────────────────────────────────────
export async function getDocuments(): Promise<Document[]> {
  await delay(500)
  return MOCK_DOCUMENTS
}

export async function getDocument(id: string): Promise<Document | null> {
  await delay(200)
  return MOCK_DOCUMENTS.find(d => d.id === id) ?? null
}

export async function uploadDocument(file: File, meta: Partial<Document>): Promise<Document> {
  await delay(2000)
  const newDoc: Document = {
    id: Date.now().toString(),
    name: meta.name ?? file.name,
    department: meta.department ?? 'HR',
    type: 'PDF',
    access: meta.access ?? 'employee',
    status: 'processing',
    pages: 0,
    size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    uploadedBy: 'Current User',
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    description: meta.description,
    indexed: false,
  }
  return newDoc
}

// ─── Search History ───────────────────────────────────────
export async function getSearchHistory(): Promise<SearchHistoryItem[]> {
  await delay(400)
  return MOCK_HISTORY
}

// ─── Knowledge Gaps ───────────────────────────────────────
export async function getKnowledgeGaps(): Promise<KnowledgeGap[]> {
  await delay(400)
  return MOCK_KNOWLEDGE_GAPS
}

// ─── Analytics ────────────────────────────────────────────
export async function getAnalytics(): Promise<AnalyticsData> {
  await delay(600)
  return MOCK_ANALYTICS
}

// ─── Users ────────────────────────────────────────────────
export async function getUsers(): Promise<User[]> {
  await delay(400)
  return MOCK_USERS
}

export async function updateUserRole(userId: string, _role: string): Promise<User | null> {
  await delay(300)
  return MOCK_USERS.find(u => u.id === userId) ?? null
}

export async function deleteUser(_userId: string): Promise<void> {
  await delay(300)
}

// ─── Audit Logs ───────────────────────────────────────────
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  await delay(400)
  return MOCK_AUDIT_LOGS
}

// ─── Notifications ────────────────────────────────────────
export async function getNotifications(): Promise<Notification[]> {
  await delay(200)
  return MOCK_NOTIFICATIONS
}
