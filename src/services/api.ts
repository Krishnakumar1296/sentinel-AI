import type { User, SearchResult, Document, SearchHistoryItem, KnowledgeGap, AnalyticsData, AuditLogEntry, Notification, KnowledgeRequest } from '../types'
import {
  MOCK_USERS, MOCK_DOCUMENTS, MOCK_SEARCH_RESULTS,
  MOCK_HISTORY, MOCK_KNOWLEDGE_GAPS, MOCK_ANALYTICS,
  MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS,
} from './mockData'

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

// In-memory history recorded from live searches
const savedHistory: SearchHistoryItem[] = []
// Full conversations (Q&A) recorded from live searches, keyed by history id
const savedConversations = new Map<string, SearchResult>()

// ─── Documents & Notifications store (mutable) ─────────────
const docs = [...MOCK_DOCUMENTS]
const mutableNotifications: Notification[] = [...MOCK_NOTIFICATIONS]

const DEFAULT_PASSWORD = 'password123'
// Mutable users + login credentials (username/password) managed by admin
const users = [...MOCK_USERS]
const credentials = new Map<string, string>(MOCK_USERS.map((u) => [u.id, DEFAULT_PASSWORD]))
const usernames = new Map<string, string>(MOCK_USERS.map((u) => [u.id, u.email.split('@')[0].toLowerCase()]))

function setUsername(userId: string, username?: string): boolean {
  const clean = username?.trim().toLowerCase() ?? ''
  for (const [uid, name] of [...usernames]) {
    if (uid !== userId && name === clean) return false
  }
  if (clean) usernames.set(userId, clean)
  return true
}

function pushNotification(type: Notification['type'], title: string, message: string, action?: string, requestId?: string): void {
  mutableNotifications.unshift({
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    title,
    message,
    timestamp: 'Just now',
    read: false,
    action,
    requestId,
  })
}

// ─── Knowledge Requests (admin workflow) ───────────────────
const knowledgeRequests: KnowledgeRequest[] = []

export interface DocumentEdits {
  name: string
  department: string
  description: string
  content: string
}

export const PAGE_BREAK = '\n\n◆◆ PAGE BREAK ◆◆\n\n'

function contentPages(content: string): number {
  return content.split(PAGE_BREAK).filter((p) => p.trim().length > 0).length
}

export async function reportUnanswered(query: string): Promise<void> {
  await delay(0)
  const lower = query.trim().toLowerCase()
  const duplicate = knowledgeRequests.some((r) => r.status === 'pending' && r.question.toLowerCase() === lower)
  if (duplicate) return
  const request: KnowledgeRequest = {
    id: `kr-${Date.now()}`,
    question: query.trim(),
    askedBy: 'Team Member',
    timestamp: new Date().toLocaleString(),
    status: 'pending',
  }
  knowledgeRequests.unshift(request)
  pushNotification('warning', 'New Knowledge Request', `"${query.trim()}" — information not found in the documents. Click to update the knowledge base.`, '/requests', request.id)
}

export async function getKnowledgeRequests(): Promise<KnowledgeRequest[]> {
  await delay(300)
  return [...knowledgeRequests]
}

export async function publishDocumentForRequest(requestId: string, edits: DocumentEdits): Promise<Document | null> {
  await delay(700)
  const request = knowledgeRequests.find((r) => r.id === requestId)
  if (!request) return null
  const doc: Document = {
    id: `d-${Date.now()}`,
    name: edits.name,
    department: edits.department,
    type: 'PDF',
    access: 'employee',
    status: 'active',
    pages: contentPages(edits.content),
    size: '2.0 MB',
    uploadedBy: 'Admin',
    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    description: edits.description,
    content: edits.content,
    indexed: true,
  }
  docs.unshift(doc)
  request.status = 'resolved'
  request.documentId = doc.id
  pushNotification('success', 'Your question has been answered', `A new document "${doc.name}" was added covering "${request.question}". Open AI Knowledge Search to ask it again.`, '/search')
  return doc
}

// ─── Chat (ChatGPT-style conversation threads) ───
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

const chatId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
const nowLabel = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

let chats: ChatSession[] = []
let activeChatId: string | null = null

function ensureChat(): ChatSession {
  if (activeChatId) {
    const found = chats.find((c) => c.id === activeChatId)
    if (found) return found
  }
  const chat: ChatSession = {
    id: chatId(),
    title: 'New Chat',
    createdAt: nowLabel(),
    updatedAt: nowLabel(),
    messages: [],
  }
  chats.unshift(chat)
  activeChatId = chat.id
  return chat
}

export async function getChats(): Promise<ChatSession[]> {
  await delay(60)
  return chats
}

export async function getActiveChat(): Promise<ChatSession | null> {
  await delay(60)
  if (!activeChatId) return null
  return chats.find((c) => c.id === activeChatId) ?? null
}

export async function openChat(id: string): Promise<ChatSession | null> {
  await delay(80)
  const chat = chats.find((c) => c.id === id) ?? null
  if (chat) activeChatId = chat.id
  return chat
}

export async function startNewChat(): Promise<ChatSession> {
  await delay(80)
  const chat: ChatSession = {
    id: chatId(),
    title: 'New Chat',
    createdAt: nowLabel(),
    updatedAt: nowLabel(),
    messages: [],
  }
  chats.unshift(chat)
  activeChatId = chat.id
  return chat
}

function titleFor(query: string): string {
  return query.length > 42 ? `${query.slice(0, 42)}…` : query
}

export async function appendChatTurn(query: string, result: SearchResult): Promise<ChatSession> {
  await delay(0)
  const chat = ensureChat()
  const now = nowLabel()
  chat.messages.push(
    { id: `${chat.id}-u-${chat.messages.length + 1}`, role: 'user', content: query, timestamp: now },
    { id: `${chat.id}-a-${chat.messages.length + 2}`, role: 'assistant', content: result.answer, result, timestamp: now },
  )
  chat.updatedAt = now
  if (chat.title === 'New Chat') chat.title = titleFor(query)
  return chat
}

// Continue a stored conversation: merges it into the active chat (deduped by result id)
export async function continueConversation(convId: string): Promise<ChatSession | null> {
  await delay(80)
  const chat = ensureChat()
  const found = savedConversations.get(convId) ?? MOCK_CONVERSATIONS[convId] ?? null
  if (!found) return chat
  const duplicate = chat.messages.some((m) => m.result?.id === found.id)
  if (!duplicate) {
    const now = nowLabel()
    chat.messages.push(
      { id: `${chat.id}-u-${chat.messages.length + 1}`, role: 'user', content: found.query, timestamp: now },
      { id: `${chat.id}-a-${chat.messages.length + 2}`, role: 'assistant', content: found.answer, result: found, timestamp: now },
    )
    chat.updatedAt = now
    if (chat.title === 'New Chat') chat.title = titleFor(found.query)
  }
  return chat
}

// ─── Auth ─────────────────────────────────────────────────
export async function loginUser(identifier: string, password: string): Promise<User | null> {
  await delay(800)
  const key = identifier.trim().toLowerCase()
  let match = users.find((u) => u.email.toLowerCase() === key)
  if (!match) {
    const uid = usernames.get(key)
    if (uid) match = users.find((u) => u.id === uid)
  }
  if (!match) return null
  const correct = credentials.get(match.id) ?? DEFAULT_PASSWORD
  if (password !== correct) return null
  return match
}

export async function logoutUser(): Promise<void> {
  await delay(200)
}

export async function getCurrentUser(id: string): Promise<User | null> {
  await delay(100)
  return users.find(u => u.id === id) ?? null
}

// ─── Knowledge Search ─────────────────────────────────────
export async function searchKnowledge(query: string): Promise<SearchResult> {
  await delay(2200)
  // Return mock or generate no-answer
  const existing = MOCK_SEARCH_RESULTS[0]
  const lowerQuery = query.toLowerCase()
  const hasAnswer = lowerQuery.includes('remote') || lowerQuery.includes('leave') ||
    lowerQuery.includes('policy') || lowerQuery.includes('handbook') || lowerQuery.includes('data')

  let result: SearchResult

  if (!hasAnswer) {
    result = {
      id: Date.now().toString(),
      query,
      answer: '',
      confidence: 0,
      sources: [],
      timestamp: new Date().toLocaleString(),
      status: 'no_answer',
      responseTime: 2.1,
    }
    void reportUnanswered(query)
  } else {
    result = {
      ...existing,
      id: Date.now().toString(),
      query,
      timestamp: 'Just now',
    }
  }

  savedConversations.set(result.id, result)
  savedHistory.unshift({
    id: result.id,
    query: result.query,
    timestamp: result.timestamp,
    status: result.status,
    confidence: result.confidence,
    sourcesCount: result.sources.length,
    responseTime: result.responseTime,
  })

  await appendChatTurn(query, result)

  return result
}

// Load a past conversation (query + answer + sources) without re-running the search
export async function getSearchConversation(id: string): Promise<SearchResult | null> {
  await delay(150)
  return savedConversations.get(id) ?? MOCK_CONVERSATIONS[id] ?? null
}

// ─── Documents ────────────────────────────────────────────
export async function getDocuments(): Promise<Document[]> {
  await delay(500)
  return docs
}

export async function getDocument(id: string): Promise<Document | null> {
  await delay(200)
  return docs.find(d => d.id === id) ?? null
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
  docs.unshift(newDoc)
  return newDoc
}

// ─── Document updates (admin edit workflow) ────────────────
export async function updateDocument(id: string, edits: DocumentEdits): Promise<Document | null> {
  await delay(600)
  const doc = docs.find(d => d.id === id)
  if (!doc) return null
  doc.name = edits.name
  doc.department = edits.department
  doc.description = edits.description
  doc.content = edits.content
  doc.pages = contentPages(edits.content) || doc.pages
  doc.updatedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  pushNotification('success', 'Document Updated', `"${doc.name}" was updated and is now available for search.`, '/search')
  return doc
}

// ─── Search History ───────────────────────────────────────
export async function getSearchHistory(): Promise<SearchHistoryItem[]> {
  await delay(400)
  const savedIds = new Set(savedHistory.map(h => h.id))
  const mock = MOCK_HISTORY.filter(h => !savedIds.has(h.id))
  return [...savedHistory, ...mock]
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
  return users
}

export interface NewUserInput {
  name: string
  email: string
  username?: string
  password?: string
  department: string
  role: User['role']
}

export async function addUser(input: NewUserInput): Promise<User | null> {
  await delay(500)
  const emailKey = input.email.trim().toLowerCase()
  if (users.some((u) => u.email.toLowerCase() === emailKey)) return null
  const created: User = {
    id: `u${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    department: input.department,
    role: input.role,
    status: 'active',
    lastActive: 'Just now',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  users.unshift(created)
  credentials.set(created.id, input.password?.trim() || DEFAULT_PASSWORD)
  const username = input.username?.trim() ?? created.email.split('@')[0]
  if (!setUsername(created.id, username)) {
    // fall back to full email as username if the given one is taken
    usernames.set(created.id, created.email.toLowerCase())
  }
  return created
}

export async function updateUserProfile(
  userId: string,
  fields: { name?: string; email?: string; department?: string; role?: User['role']; username?: string; password?: string },
): Promise<User | null> {
  await delay(400)
  const user = users.find((u) => u.id === userId)
  if (!user) return null
  if (fields.name !== undefined) user.name = fields.name
  if (fields.email !== undefined) user.email = fields.email
  if (fields.department !== undefined) user.department = fields.department
  if (fields.role !== undefined) user.role = fields.role
  if (fields.username !== undefined) {
    const clean = fields.username.trim()
    if (clean) setUsername(userId, clean)
  }
  if (fields.password !== undefined && fields.password.trim()) {
    credentials.set(userId, fields.password.trim())
  }
  return user
}

export async function updateUserRole(userId: string, role: User['role']): Promise<User | null> {
  await delay(300)
  return updateUserProfile(userId, { role })
}

export async function deleteUser(userId: string): Promise<void> {
  await delay(300)
  const idx = users.findIndex((u) => u.id === userId)
  if (idx >= 0) users.splice(idx, 1)
  credentials.delete(userId)
  usernames.delete(userId)
}

// ─── Audit Logs ───────────────────────────────────────────
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  await delay(400)
  return MOCK_AUDIT_LOGS
}

// ─── Notifications ────────────────────────────────────────
export async function getNotifications(): Promise<Notification[]> {
  await delay(200)
  return mutableNotifications
}
