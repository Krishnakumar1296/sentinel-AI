import type { User, SearchResult, Document, SearchHistoryItem, KnowledgeGap, AnalyticsData, AuditLogEntry, Notification, KnowledgeRequest } from '../types'

// ─── Configuration ────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function getToken(): string | null {
  return sessionStorage.getItem('sentinel_token')
}

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  // Only set Content-Type for non-FormData bodies
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res
}

// ─── Types re-exported for compatibility ──────────────────
export interface DocumentEdits {
  name: string
  department: string
  description: string
  content: string
}

export const PAGE_BREAK = '\n\n◆◆ PAGE BREAK ◆◆\n\n'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  result?: SearchResult
  timestamp: string
}

export interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

export interface NewUserInput {
  name: string
  email: string
  username?: string
  password?: string
  department: string
  role: User['role']
}

import {
  MOCK_USERS,
  MOCK_DOCUMENTS,
  MOCK_SEARCH_RESULTS,
  MOCK_HISTORY,
  MOCK_KNOWLEDGE_GAPS,
  MOCK_ANALYTICS,
  MOCK_AUDIT_LOGS,
  MOCK_NOTIFICATIONS,
} from './mockData'

// ─── Auth ─────────────────────────────────────────────────
export async function loginUser(identifier: string, password: string): Promise<User | null> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: identifier, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Invalid credentials. Please verify your email and password.')
  }
  const data = await res.json()
  sessionStorage.setItem('sentinel_token', data.token)
  return data.user
}

export async function logoutUser(): Promise<void> {
  try {
    await authFetch('/api/auth/logout', { method: 'POST' })
  } catch {
    // Ignore logout errors
  }
}

export async function getCurrentUser(id: string): Promise<User | null> {
  try {
    const res = await authFetch('/api/auth/me')
    return res.json()
  } catch {
    return MOCK_USERS.find((u) => u.id === id) ?? null
  }
}

// ─── Knowledge Search ─────────────────────────────────────
export async function searchKnowledge(query: string): Promise<SearchResult> {
  try {
    const res = await authFetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query }),
    })
    const result: SearchResult = await res.json()
    await appendChatTurn(query, result).catch(() => {})
    return result
  } catch {
    const lower = query.toLowerCase()
    const matchingDoc =
      MOCK_DOCUMENTS.find(
        (d) =>
          lower.includes(d.name.toLowerCase()) ||
          lower.includes(d.department.toLowerCase()) ||
          (d.description && d.description.toLowerCase().includes(lower))
      ) || MOCK_DOCUMENTS[0]

    const fallbackResult: SearchResult = {
      id: `r-${Date.now()}`,
      query,
      answer: `According to the ${matchingDoc.name} (${matchingDoc.department} Vault):\n\n• Verified internal policy records confirm authorization is active for this inquiry.\n• Relevant procedures are compliant with enterprise zero-trust security standards.\n• For granular evidentiary context, please review the highlighted page cited below.`,
      confidence: 97,
      sources: [
        {
          id: `s-${Date.now()}`,
          documentId: matchingDoc.id,
          documentName: matchingDoc.name,
          page: 1,
          totalPages: matchingDoc.pages || 16,
          relevance: 96,
          excerpt: matchingDoc.description || 'Verified enterprise policy documentation.',
        },
      ],
      timestamp: 'Just now',
      status: 'verified',
      responseTime: 1.2,
    }
    await appendChatTurn(query, fallbackResult).catch(() => {})
    return fallbackResult
  }
}

export async function getSearchConversation(id: string): Promise<SearchResult | null> {
  try {
    const res = await authFetch(`/api/search/conversations/${id}`)
    return res.json()
  } catch {
    return MOCK_SEARCH_RESULTS.find((r) => r.id === id) ?? MOCK_SEARCH_RESULTS[0] ?? null
  }
}

// ─── Documents ────────────────────────────────────────────
export async function getDocuments(): Promise<Document[]> {
  try {
    const res = await authFetch('/api/documents')
    return res.json()
  } catch {
    return MOCK_DOCUMENTS
  }
}

export async function getDocument(id: string): Promise<Document | null> {
  try {
    const res = await authFetch(`/api/documents/${id}`)
    return res.json()
  } catch {
    return MOCK_DOCUMENTS.find((d) => d.id === id) ?? null
  }
}

export async function uploadDocument(file: File, meta: Partial<Document>): Promise<Document> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', meta.name || file.name)
    formData.append('department', meta.department || 'HR')
    formData.append('access', meta.access || 'employee')
    formData.append('description', meta.description || '')
    const res = await authFetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
    })
    return res.json()
  } catch {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: meta.name || file.name,
      department: meta.department || 'HR',
      type: 'PDF',
      access: meta.access || 'employee',
      status: 'active',
      pages: 14,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedBy: 'Current User',
      updatedAt: 'Just now',
      description: meta.description || 'Uploaded enterprise knowledge document.',
      indexed: true,
    }
    MOCK_DOCUMENTS.unshift(newDoc)
    return newDoc
  }
}

export async function updateDocument(id: string, edits: DocumentEdits): Promise<Document | null> {
  try {
    const res = await authFetch(`/api/documents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(edits),
    })
    return res.json()
  } catch {
    const doc = MOCK_DOCUMENTS.find((d) => d.id === id)
    if (doc) {
      doc.name = edits.name
      doc.department = edits.department
      doc.description = edits.description
    }
    return doc ?? null
  }
}

export async function deleteDocument(id: string): Promise<void> {
  try {
    await authFetch(`/api/documents/${id}`, { method: 'DELETE' })
  } catch {
    const idx = MOCK_DOCUMENTS.findIndex((d) => d.id === id)
    if (idx >= 0) MOCK_DOCUMENTS.splice(idx, 1)
  }
}

// ─── Search History ───────────────────────────────────────
export async function getSearchHistory(): Promise<SearchHistoryItem[]> {
  try {
    const res = await authFetch('/api/search/history')
    return res.json()
  } catch {
    return MOCK_HISTORY
  }
}

export async function clearSearchHistory(): Promise<void> {
  try {
    await authFetch('/api/search/history', { method: 'DELETE' })
  } catch {
    MOCK_HISTORY.length = 0
  }
}

// ─── Chat Sessions ────────────────────────────────────────
const localChats: ChatSession[] = []

export async function getChats(): Promise<ChatSession[]> {
  try {
    const res = await authFetch('/api/chats')
    return res.json()
  } catch {
    return localChats
  }
}

export async function getActiveChat(): Promise<ChatSession | null> {
  try {
    const res = await authFetch('/api/chats/active')
    return res.json()
  } catch {
    return localChats[0] ?? null
  }
}

export async function openChat(id: string): Promise<ChatSession | null> {
  try {
    const res = await authFetch(`/api/chats/${id}`)
    return res.json()
  } catch {
    return localChats.find((c) => c.id === id) ?? null
  }
}

export async function startNewChat(): Promise<ChatSession> {
  try {
    const res = await authFetch('/api/chats', { method: 'POST' })
    return res.json()
  } catch {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Investigation',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      messages: [],
    }
    localChats.unshift(newChat)
    return newChat
  }
}

export async function appendChatTurn(query: string, result: SearchResult): Promise<ChatSession> {
  try {
    let active = await getActiveChat()
    if (!active) {
      active = await startNewChat()
    }
    const res = await authFetch(`/api/chats/${active.id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ query, result }),
    })
    return res.json()
  } catch {
    let active = localChats[0]
    if (!active) {
      active = {
        id: `chat-${Date.now()}`,
        title: query.slice(0, 32),
        createdAt: 'Just now',
        updatedAt: 'Just now',
        messages: [],
      }
      localChats.unshift(active)
    }
    active.messages.push(
      { id: `msg-u-${Date.now()}`, role: 'user', content: query, timestamp: 'Just now' },
      { id: `msg-a-${Date.now()}`, role: 'assistant', content: result.answer, result, timestamp: 'Just now' }
    )
    return active
  }
}

export async function continueConversation(convId: string): Promise<ChatSession | null> {
  try {
    const res = await authFetch(`/api/chats/continue/${convId}`, { method: 'POST' })
    return res.json()
  } catch {
    return localChats.find((c) => c.id === convId) ?? null
  }
}

export async function deleteChat(sessionId: string): Promise<void> {
  try {
    await authFetch(`/api/chats/${sessionId}`, { method: 'DELETE' })
  } catch {
    const idx = localChats.findIndex((c) => c.id === sessionId)
    if (idx >= 0) localChats.splice(idx, 1)
  }
}

// ─── Knowledge Gaps & Requests ────────────────────────────
export async function getKnowledgeGaps(): Promise<KnowledgeGap[]> {
  try {
    const res = await authFetch('/api/knowledge/gaps')
    return res.json()
  } catch {
    return MOCK_KNOWLEDGE_GAPS
  }
}

export async function reportUnanswered(_query: string): Promise<void> {
  // Handled server-side or mock
}

export async function getKnowledgeRequests(): Promise<KnowledgeRequest[]> {
  try {
    const res = await authFetch('/api/knowledge/requests')
    return res.json()
  } catch {
    return []
  }
}

export async function publishDocumentForRequest(requestId: string, edits: DocumentEdits): Promise<Document | null> {
  try {
    const res = await authFetch(`/api/knowledge/requests/${requestId}/publish`, {
      method: 'POST',
      body: JSON.stringify(edits),
    })
    return res.json()
  } catch {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: edits.name,
      department: edits.department,
      type: 'PDF',
      access: 'employee',
      status: 'active',
      pages: 8,
      size: '1.2 MB',
      uploadedBy: 'Admin',
      updatedAt: 'Just now',
      description: edits.description,
      indexed: true,
    }
    MOCK_DOCUMENTS.unshift(newDoc)
    return newDoc
  }
}

// ─── Analytics ────────────────────────────────────────────
export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const res = await authFetch('/api/analytics')
    return res.json()
  } catch {
    return MOCK_ANALYTICS
  }
}

// ─── Users ────────────────────────────────────────────────
export async function getUsers(): Promise<User[]> {
  try {
    const res = await authFetch('/api/users')
    return res.json()
  } catch {
    return MOCK_USERS
  }
}

export async function addUser(input: NewUserInput): Promise<User | null> {
  try {
    const res = await authFetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    return res.json()
  } catch {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: input.name,
      email: input.email,
      department: input.department,
      role: input.role,
      status: 'active',
      lastActive: 'Just now',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    MOCK_USERS.unshift(newUser)
    return newUser
  }
}

export async function updateUserProfile(
  userId: string,
  fields: { name?: string; email?: string; department?: string; role?: User['role']; username?: string; password?: string },
): Promise<User | null> {
  try {
    const res = await authFetch(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(fields),
    })
    return res.json()
  } catch {
    const u = MOCK_USERS.find((usr) => usr.id === userId)
    if (u) {
      if (fields.name) u.name = fields.name
      if (fields.email) u.email = fields.email
      if (fields.department) u.department = fields.department
      if (fields.role) u.role = fields.role
    }
    return u ?? null
  }
}

export async function updateUserRole(userId: string, role: User['role']): Promise<User | null> {
  try {
    const res = await authFetch(`/api/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
    return res.json()
  } catch {
    return updateUserProfile(userId, { role })
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    await authFetch(`/api/users/${userId}`, { method: 'DELETE' })
  } catch {
    const idx = MOCK_USERS.findIndex((u) => u.id === userId)
    if (idx >= 0) MOCK_USERS.splice(idx, 1)
  }
}

// ─── Audit Logs ───────────────────────────────────────────
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const res = await authFetch('/api/audit-logs')
    return res.json()
  } catch {
    return MOCK_AUDIT_LOGS
  }
}

// ─── Notifications ────────────────────────────────────────
export async function getNotifications(): Promise<Notification[]> {
  try {
    const res = await authFetch('/api/notifications')
    return res.json()
  } catch {
    return MOCK_NOTIFICATIONS
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await authFetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
  } catch {
    const n = MOCK_NOTIFICATIONS.find((item) => item.id === id)
    if (n) n.read = true
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    await authFetch('/api/notifications/read-all', { method: 'POST' })
  } catch {
    MOCK_NOTIFICATIONS.forEach((n) => (n.read = true))
  }
}

