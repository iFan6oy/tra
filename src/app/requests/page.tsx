'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlaneTakeoff, Search, Filter, Plus } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { fetchRequests } from '@/lib/api'
import StatusBadge from '@/components/StatusBadge'

const statusFilters = [
  'ALL', 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'TRAVEL_COMPLETE',
  'REIMBURSEMENT_PENDING', 'PAID', 'REJECTED',
]

type Request = {
  id: string
  requestNumber: string
  status: string
  purpose: string
  destination: string
  departureDate: string
  returnDate: string
  estimatedTotal: number
  actualTotal: number
  requester: { name: string }
}

export default function RequestsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchRequests(user.id).then((data) => {
      setRequests(data)
      setLoading(false)
    })
  }, [user])

  const filtered = requests.filter((req) => {
    if (filter !== 'ALL' && req.status !== filter) return false
    if (search && !req.purpose.toLowerCase().includes(search.toLowerCase()) &&
        !req.destination.toLowerCase().includes(search.toLowerCase()) &&
        !req.requestNumber.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Requests</h1>
          <p className="text-muted text-sm mt-1">Manage your travel requests and reimbursements</p>
        </div>
        <Link
          href="/requests/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent/25"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by purpose, destination, or request #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-4 h-4 text-muted shrink-0" />
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === s
                    ? 'bg-accent text-white'
                    : 'bg-card-border/50 text-muted hover:text-foreground'
                }`}
              >
                {s === 'ALL' ? 'All' : s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="px-5 py-12 text-center text-muted">Loading requests...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-card-border text-left text-xs text-muted uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Request #</th>
                <th className="px-5 py-3 font-medium">Purpose</th>
                <th className="px-5 py-3 font-medium">Destination</th>
                <th className="px-5 py-3 font-medium">Dates</th>
                <th className="px-5 py-3 font-medium">Estimated</th>
                <th className="px-5 py-3 font-medium">Actual</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-black/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/requests/${req.id}`} className="text-accent font-medium text-sm hover:underline">
                      {req.requestNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm">{req.purpose}</td>
                  <td className="px-5 py-4 text-sm text-muted">{req.destination}</td>
                  <td className="px-5 py-4 text-sm text-muted whitespace-nowrap">
                    {new Date(req.departureDate).toLocaleDateString()} - {new Date(req.returnDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium">${req.estimatedTotal.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm font-medium">
                    {req.actualTotal > 0 ? `$${req.actualTotal.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={req.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted">
                    <PlaneTakeoff className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p>No requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
