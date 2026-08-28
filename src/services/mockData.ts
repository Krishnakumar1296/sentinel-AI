import type {
  User, Document, SearchResult, SearchHistoryItem,
  KnowledgeGap, AnalyticsData, AuditLogEntry, Notification
} from '../types'

// ─── Mock Users ───────────────────────────────────────────
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Krishna Kumar', email: 'krishna@company.com', department: 'Engineering', role: 'admin', status: 'active', lastActive: 'Just now', createdAt: '2024-01-15' },
  { id: 'u2', name: 'Sarah Mitchell', email: 'sarah@company.com', department: 'HR', role: 'manager', status: 'active', lastActive: '2 hours ago', createdAt: '2024-02-01' },
  { id: 'u3', name: 'James Park', email: 'james@company.com', department: 'Finance', role: 'manager', status: 'active', lastActive: '1 day ago', createdAt: '2024-01-20' },
  { id: 'u4', name: 'Emily Chen', email: 'emily@company.com', department: 'Engineering', role: 'employee', status: 'active', lastActive: '3 hours ago', createdAt: '2024-03-05' },
  { id: 'u5', name: 'Michael Torres', email: 'michael@company.com', department: 'Legal', role: 'employee', status: 'active', lastActive: '5 hours ago', createdAt: '2024-02-28' },
  { id: 'u6', name: 'Lisa Wang', email: 'lisa@company.com', department: 'Operations', role: 'employee', status: 'inactive', lastActive: '1 week ago', createdAt: '2024-01-10' },
]

export const MOCK_DOCUMENTS: Document[] = [
  { id: 'd1', name: 'Employee Handbook 2024', department: 'HR', type: 'PDF', access: 'employee', status: 'active', pages: 48, size: '3.2 MB', uploadedBy: 'Sarah Mitchell', updatedAt: 'Aug 28, 2026', description: 'Complete employee handbook covering policies, benefits and conduct guidelines.', indexed: true },
  { id: 'd2', name: 'Data Security Policy', department: 'IT', type: 'PDF', access: 'employee', status: 'active', pages: 22, size: '1.8 MB', uploadedBy: 'IT Admin', updatedAt: 'Aug 26, 2026', description: 'Information security policy and data handling guidelines.', indexed: true },
  { id: 'd3', name: 'Q3 Financial Report', department: 'Finance', type: 'PDF', access: 'finance', status: 'restricted', pages: 64, size: '5.4 MB', uploadedBy: 'James Park', updatedAt: 'Aug 24, 2026', description: 'Q3 2026 financial performance report.', indexed: true },
  { id: 'd4', name: 'Executive Strategy 2026', department: 'Management', type: 'PDF', access: 'admin', status: 'restricted', pages: 32, size: '2.1 MB', uploadedBy: 'Krishna Kumar', updatedAt: 'Aug 20, 2026', description: 'Company strategic plan for 2026.', indexed: true },
  { id: 'd5', name: 'Remote Work Guidelines', department: 'HR', type: 'PDF', access: 'employee', status: 'active', pages: 18, size: '1.2 MB', uploadedBy: 'Sarah Mitchell', updatedAt: 'Aug 22, 2026', description: 'Guidelines for remote and hybrid work arrangements.', indexed: true },
  { id: 'd6', name: 'Legal Compliance Manual', department: 'Legal', type: 'PDF', access: 'manager', status: 'active', pages: 56, size: '4.1 MB', uploadedBy: 'Michael Torres', updatedAt: 'Aug 18, 2026', description: 'Regulatory compliance requirements and procedures.', indexed: true },
  { id: 'd7', name: 'IT Onboarding Checklist', department: 'IT', type: 'PDF', access: 'employee', status: 'active', pages: 12, size: '0.8 MB', uploadedBy: 'IT Admin', updatedAt: 'Aug 15, 2026', description: 'New employee IT setup and access request procedures.', indexed: true },
  { id: 'd8', name: 'Benefits Package Overview', department: 'HR', type: 'PDF', access: 'employee', status: 'processing', pages: 0, size: '2.4 MB', uploadedBy: 'Sarah Mitchell', updatedAt: 'Aug 28, 2026', description: 'Employee benefits package details for 2026.', indexed: false },
]

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: 'r1',
    query: 'What is the company\'s remote work policy?',
    answer: `According to the Remote Work Guidelines (Section 3.2), employees are eligible for remote work arrangements under the following conditions:\n\n• Employees must have completed at least 3 months of employment\n• A formal remote work agreement must be signed with the HR department\n• Employees are entitled to work remotely up to 3 days per week (hybrid model)\n• Full remote work requires manager approval and is reviewed quarterly\n\nAll remote employees must maintain core working hours of 10:00 AM – 3:00 PM in their local timezone and ensure a secure, dedicated workspace. IT equipment for remote work is provided by the company after successful onboarding.`,
    confidence: 96,
    sources: [
      { id: 's1', documentId: 'd5', documentName: 'Remote Work Guidelines', page: 8, totalPages: 18, relevance: 96, excerpt: 'Employees are entitled to work remotely up to 3 days per week under the hybrid work model...' },
      { id: 's2', documentId: 'd1', documentName: 'Employee Handbook 2024', page: 24, totalPages: 48, relevance: 84, excerpt: 'Remote work arrangements must be formalized through the HR department with a signed agreement...' },
    ],
    timestamp: 'Today, 4:32 PM',
    status: 'verified',
    responseTime: 2.4,
  },
]

export const MOCK_HISTORY: SearchHistoryItem[] = [
  { id: 'h1', query: 'What is the remote work policy?', timestamp: 'Today, 4:32 PM', status: 'verified', confidence: 96, sourcesCount: 3, responseTime: 2.4 },
  { id: 'h2', query: 'How many days of annual leave do I get?', timestamp: 'Today, 2:15 PM', status: 'verified', confidence: 98, sourcesCount: 2, responseTime: 1.8 },
  { id: 'h3', query: 'What is the AI usage policy for employees?', timestamp: 'Today, 11:03 AM', status: 'no_answer', confidence: 0, sourcesCount: 0, responseTime: 2.1 },
  { id: 'h4', query: 'Explain our data retention policy', timestamp: 'Yesterday, 3:45 PM', status: 'verified', confidence: 91, sourcesCount: 4, responseTime: 3.2 },
  { id: 'h5', query: 'What are the onboarding requirements for new employees?', timestamp: 'Yesterday, 10:22 AM', status: 'verified', confidence: 94, sourcesCount: 2, responseTime: 2.7 },
  { id: 'h6', query: 'New vendor approval process?', timestamp: 'Aug 26, 2:11 PM', status: 'no_answer', confidence: 0, sourcesCount: 0, responseTime: 1.9 },
  { id: 'h7', query: 'What is the expense reimbursement procedure?', timestamp: 'Aug 26, 9:34 AM', status: 'partial', confidence: 67, sourcesCount: 1, responseTime: 2.2 },
]

export const MOCK_KNOWLEDGE_GAPS: KnowledgeGap[] = [
  { id: 'g1', question: 'What is our AI usage policy for employees?', frequency: 48, priority: 'high', department: 'Engineering', firstSeen: 'Aug 20', lastSeen: 'Aug 28', status: 'open' },
  { id: 'g2', question: 'Remote contractor working policy?', frequency: 31, priority: 'high', department: 'HR', firstSeen: 'Aug 15', lastSeen: 'Aug 27', status: 'open' },
  { id: 'g3', question: 'New vendor approval process?', frequency: 22, priority: 'medium', department: 'Operations', firstSeen: 'Aug 10', lastSeen: 'Aug 26', status: 'in_progress' },
  { id: 'g4', question: 'International travel reimbursement policy?', frequency: 14, priority: 'low', department: 'Finance', firstSeen: 'Aug 5', lastSeen: 'Aug 24', status: 'open' },
  { id: 'g5', question: 'Software license procurement process?', frequency: 12, priority: 'medium', department: 'IT', firstSeen: 'Aug 1', lastSeen: 'Aug 22', status: 'open' },
  { id: 'g6', question: 'Performance review cycle timeline?', frequency: 9, priority: 'low', department: 'HR', firstSeen: 'Aug 12', lastSeen: 'Aug 20', status: 'open' },
]

export const MOCK_ANALYTICS: AnalyticsData = {
  totalQueries: 8426,
  successfulAnswers: 7982,
  failedQueries: 444,
  avgResponseTime: 2.8,
  faithfulnessScore: 94.8,
  contextRelevance: 92.3,
  answerConfidence: 91.5,
  retrievalPrecision: 96.2,
  queryTrend: [
    { date: 'Aug 22', queries: 310, successful: 291 },
    { date: 'Aug 23', queries: 340, successful: 318 },
    { date: 'Aug 24', queries: 280, successful: 259 },
    { date: 'Aug 25', queries: 390, successful: 368 },
    { date: 'Aug 26', queries: 420, successful: 398 },
    { date: 'Aug 27', queries: 380, successful: 359 },
    { date: 'Aug 28', queries: 450, successful: 428 },
  ],
  topDepartments: [
    { name: 'Engineering', queries: 2840 },
    { name: 'HR', queries: 1920 },
    { name: 'Finance', queries: 1340 },
    { name: 'Operations', queries: 980 },
    { name: 'Legal', queries: 760 },
  ],
  gapsByDepartment: [
    { department: 'HR', count: 8 },
    { department: 'Finance', count: 5 },
    { department: 'IT Security', count: 4 },
    { department: 'Operations', count: 3 },
    { department: 'Legal', count: 2 },
    { department: 'Engineering', count: 1 },
  ],
}

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'a1', timestamp: 'Today, 10:42 AM', userId: 'u4', userName: 'Emily Chen', action: 'Document Accessed', resource: 'Employee Handbook 2024', status: 'success', details: 'Viewed page 24 of Employee Handbook' },
  { id: 'a2', timestamp: 'Today, 10:31 AM', userId: 'u2', userName: 'Sarah Mitchell', action: 'Document Uploaded', resource: 'Benefits Package Overview', status: 'success', details: 'Uploaded new HR policy document' },
  { id: 'a3', timestamp: 'Today, 9:54 AM', userId: 'u5', userName: 'Michael Torres', action: 'Access Blocked', resource: 'Q3 Financial Report', status: 'blocked', details: 'Employee role does not have access to Finance documents' },
  { id: 'a4', timestamp: 'Today, 9:22 AM', userId: 'u4', userName: 'Emily Chen', action: 'Knowledge Search', resource: 'Remote Work Guidelines', status: 'success', details: 'Query answered with 96% confidence' },
  { id: 'a5', timestamp: 'Yesterday, 4:15 PM', userId: 'u3', userName: 'James Park', action: 'Report Downloaded', resource: 'Q3 Financial Report', status: 'success', details: 'Full document downloaded' },
  { id: 'a6', timestamp: 'Yesterday, 3:50 PM', userId: 'u6', userName: 'Lisa Wang', action: 'Login Failed', resource: 'System', status: 'failed', details: 'Invalid credentials attempt' },
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'success', title: 'Document Processing Complete', message: 'Benefits Package Overview.pdf is now indexed and available for search.', timestamp: '2 minutes ago', read: false },
  { id: 'n2', type: 'warning', title: 'Knowledge Gap Detected', message: 'High-frequency unanswered question: "AI Usage Policy" — 48 queries with no answer.', timestamp: '15 minutes ago', read: false },
  { id: 'n3', type: 'error', title: 'Security Alert', message: 'Unauthorized document access attempt blocked for user michael@company.com.', timestamp: '1 hour ago', read: false },
  { id: 'n4', type: 'info', title: 'New Document Added', message: 'Remote Work Guidelines has been updated and re-indexed.', timestamp: '3 hours ago', read: true },
]
