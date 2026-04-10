'use client'

import { useEffect, useState } from 'react'
import {
  PlaneTakeoff,
  ClipboardCheck,
  DollarSign,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { fetchStats, fetchRequests, fetchApprovals } from '@/lib/api'
import StatusBadge from '@/components/StatusBadge'

type Stats = {
  totalRequests: number
  pendingApproval: number
  totalSpent: number
  pipeline: Record<string, number>
}

type Request = {
  id: string
  requestNumber: string
  status: string
  purpose: string
  destination: string
  departureDate: string
  estimatedTotal: number
  requester: { name: string }
}

type Approval = {
  id: string
  level: number
  request: {
    id: string
    requestNumber: string
    purpose: string
    destination: string
    estimatedTotal: number
    requester: { name: string }
  }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [approvals, setApprovals] = useState<Approval[]>([])

  useEffect(() => {
    if (!user) return
    fetchStats(user.id).then(setStats)
    fetchRequests(user.id).then((data: Request[]) => setRequests(data.slice(0, 5)))
    fetchApprovals(user.id).then(setApprovals)
  }, [user])

  if (!stats) {
    return <div className="max-w-7xl mx-auto p-8 text-muted">Loading dashboard...</div>
  }

  const statCards = [
    { label: 'Total Requests', value: stats.totalRequests, icon: PlaneTakeoff, color: 'text-accent', bgColor: 'bg-blue-50' },
    { label: 'Pending Approval', value: stats.pendingApproval, icon: ClipboardCheck, color: 'text-warning', bgColor: 'bg-amber-50' },
    { label: 'Total Reimbursed', value: `$${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'text-success', bgColor: 'bg-emerald-50' },
    { label: 'Active Requests', value: stats.totalRequests - (stats.pipeline?.paid || 0), icon: Clock, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  ]

  const pipeline = stats.pipeline || {}

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Welcome back, {user?.name?.split(' ')[0]}. Here&apos;s your travel overview.</p>
        </div>
        <Link
          href="/requests/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-accent/25"
        >
          <PlaneTakeoff className="w-4 h-4" />
          New Request
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between p-5 border-b border-card-border">
            <h2 className="font-semibold">Recent Requests</h2>
            <Link href="/requests" className="text-accent text-sm hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-card-border">
            {requests.map((req) => (
              <Link
                key={req.id}
                href={`/requests/${req.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-black/[0.02] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-sm">{req.purpose}</p>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-muted text-xs mt-1">
                    {req.requestNumber} &middot; {req.destination} &middot; {new Date(req.departureDate).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm font-semibold ml-4">
                  ${req.estimatedTotal.toLocaleString()}
                </p>
              </Link>
            ))}
            {requests.length === 0 && (
              <div className="px-5 py-8 text-center text-muted text-sm">No requests yet</div>
            )}
          </div>
        </div>

        <div className="glass-card">
          <div className="flex items-center justify-between p-5 border-b border-card-border">
            <h2 className="font-semibold">Pending Approvals</h2>
            <span className="bg-warning/10 text-warning text-xs font-semibold px-2 py-1 rounded-full">
              {approvals.length}
            </span>
          </div>
          <div className="divide-y divide-card-border">
            {approvals.map((apr) => (
              <Link
                key={apr.id}
                href={`/approvals`}
                className="block px-5 py-4 hover:bg-black/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{apr.request.requester.name}</p>
                  <p className="text-sm font-semibold">${apr.request.estimatedTotal.toLocaleString()}</p>
                </div>
                <p className="text-muted text-xs mt-1">{apr.request.purpose}</p>
                <p className="text-muted text-xs">{apr.request.destination} &middot; Level {apr.level}</p>
              </Link>
            ))}
            {approvals.length === 0 && (
              <div className="px-5 py-8 text-center text-muted text-sm">All caught up!</div>
            )}
          </div>
          <div className="p-4">
            <Link
              href="/approvals"
              className="block w-full text-center py-2 text-accent text-sm font-medium hover:bg-accent/5 rounded-lg transition-colors"
            >
              Review All Approvals
            </Link>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="font-semibold">Request Pipeline</h2>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { label: 'Draft', count: pipeline.draft || 0, color: 'bg-zinc-400' },
            { label: 'Pending', count: pipeline.pending || 0, color: 'bg-amber-400' },
            { label: 'Approved', count: pipeline.approved || 0, color: 'bg-emerald-400' },
            { label: 'Traveling', count: pipeline.traveling || 0, color: 'bg-blue-400' },
            { label: 'Reimbursement', count: pipeline.reimbursement || 0, color: 'bg-purple-400' },
            { label: 'A/P', count: pipeline.ap || 0, color: 'bg-indigo-400' },
            { label: 'Paid', count: pipeline.paid || 0, color: 'bg-green-500' },
          ].map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center min-w-[80px]">
                <div className={`w-10 h-10 rounded-full ${stage.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {stage.count}
                </div>
                <p className="text-xs text-muted mt-1.5 whitespace-nowrap">{stage.label}</p>
              </div>
              {i < 6 && <div className="w-8 h-0.5 bg-card-border shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
