// Mock data for development before DB is connected

export type MockRequest = {
  id: string
  requestNumber: string
  status: string
  currentApproverLevel: number
  purpose: string
  destination: string
  departureDate: string
  returnDate: string
  requesterId: string
  requesterName: string
  estimatedTotal: number
  actualTotal: number
  createdAt: string
}

export type MockApproval = {
  id: string
  requestId: string
  requestNumber: string
  requesterName: string
  purpose: string
  destination: string
  level: number
  status: string
  estimatedTotal: number
}

export const currentUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@company.com',
  role: 'MANAGER' as const,
  department: 'Engineering',
  initials: 'JD',
}

export const mockRequests: MockRequest[] = [
  {
    id: 'req-1',
    requestNumber: 'TR-2026-001',
    status: 'APPROVED',
    currentApproverLevel: 3,
    purpose: 'Annual DevOps Conference',
    destination: 'San Francisco, CA',
    departureDate: '2026-04-15',
    returnDate: '2026-04-18',
    requesterId: 'user-1',
    requesterName: 'John Doe',
    estimatedTotal: 2850.00,
    actualTotal: 0,
    createdAt: '2026-03-20',
  },
  {
    id: 'req-2',
    requestNumber: 'TR-2026-002',
    status: 'PENDING_APPROVAL',
    currentApproverLevel: 1,
    purpose: 'Client Meeting - Q2 Review',
    destination: 'New York, NY',
    departureDate: '2026-05-01',
    returnDate: '2026-05-03',
    requesterId: 'user-1',
    requesterName: 'John Doe',
    estimatedTotal: 1950.00,
    actualTotal: 0,
    createdAt: '2026-04-02',
  },
  {
    id: 'req-3',
    requestNumber: 'TR-2026-003',
    status: 'DRAFT',
    currentApproverLevel: 0,
    purpose: 'Team Offsite Planning',
    destination: 'Austin, TX',
    departureDate: '2026-05-15',
    returnDate: '2026-05-17',
    requesterId: 'user-1',
    requesterName: 'John Doe',
    estimatedTotal: 1200.00,
    actualTotal: 0,
    createdAt: '2026-04-08',
  },
  {
    id: 'req-4',
    requestNumber: 'TR-2026-004',
    status: 'PAID',
    currentApproverLevel: 3,
    purpose: 'AWS re:Invent',
    destination: 'Las Vegas, NV',
    departureDate: '2026-01-10',
    returnDate: '2026-01-14',
    requesterId: 'user-1',
    requesterName: 'John Doe',
    estimatedTotal: 3400.00,
    actualTotal: 3215.50,
    createdAt: '2025-12-01',
  },
  {
    id: 'req-5',
    requestNumber: 'TR-2026-005',
    status: 'REIMBURSEMENT_PENDING',
    currentApproverLevel: 2,
    purpose: 'Partner Summit',
    destination: 'Chicago, IL',
    departureDate: '2026-03-05',
    returnDate: '2026-03-07',
    requesterId: 'user-1',
    requesterName: 'John Doe',
    estimatedTotal: 1800.00,
    actualTotal: 1725.00,
    createdAt: '2026-02-15',
  },
]

export const mockPendingApprovals: MockApproval[] = [
  {
    id: 'apr-1',
    requestId: 'req-10',
    requestNumber: 'TR-2026-010',
    requesterName: 'Sarah Chen',
    purpose: 'Sales Kickoff - West Region',
    destination: 'Seattle, WA',
    level: 1,
    status: 'PENDING',
    estimatedTotal: 2100.00,
  },
  {
    id: 'apr-2',
    requestId: 'req-11',
    requestNumber: 'TR-2026-011',
    requesterName: 'Mike Johnson',
    purpose: 'Training Certification',
    destination: 'Denver, CO',
    level: 2,
    status: 'PENDING',
    estimatedTotal: 1450.00,
  },
  {
    id: 'apr-3',
    requestId: 'req-12',
    requestNumber: 'TR-2026-012',
    requesterName: 'Lisa Park',
    purpose: 'Board Presentation',
    destination: 'Boston, MA',
    level: 1,
    status: 'PENDING',
    estimatedTotal: 3200.00,
  },
]

export const stats = {
  totalRequests: 12,
  pendingApproval: 3,
  totalSpent: 8450.50,
  avgProcessingDays: 4.2,
}
