const BASE = ''

export async function fetchStats(userId?: string) {
  const params = userId ? `?userId=${userId}` : ''
  const res = await fetch(`${BASE}/api/stats${params}`)
  return res.json()
}

export async function fetchRequests(userId?: string, status?: string) {
  const params = new URLSearchParams()
  if (userId) params.set('userId', userId)
  if (status && status !== 'ALL') params.set('status', status)
  const res = await fetch(`${BASE}/api/requests?${params}`)
  return res.json()
}

export async function fetchRequest(id: string) {
  const res = await fetch(`${BASE}/api/requests/${id}`)
  return res.json()
}

export async function createRequest(data: Record<string, unknown>) {
  const res = await fetch(`${BASE}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function fetchApprovals(approverId: string) {
  const res = await fetch(`${BASE}/api/approvals?approverId=${approverId}`)
  return res.json()
}

export async function processApproval(approvalId: string, action: string, comments?: string) {
  const res = await fetch(`${BASE}/api/approvals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approvalId, action, comments }),
  })
  return res.json()
}

export async function fetchUsers() {
  const res = await fetch(`${BASE}/api/users`)
  return res.json()
}

export async function fetchAuditLog() {
  const res = await fetch(`${BASE}/api/audit`)
  return res.json()
}
