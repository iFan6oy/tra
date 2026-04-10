'use client'

import { useEffect, useState } from 'react'
import { ClipboardCheck, Check, X, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { fetchApprovals, processApproval } from '@/lib/api'

type Expense = {
  id: string
  category: string
  description: string
  amount: number
}

type ApprovalItem = {
  id: string
  level: number
  request: {
    id: string
    requestNumber: string
    purpose: string
    destination: string
    estimatedTotal: number
    requester: { name: string; email: string }
    estimates: Expense[]
  }
}

export default function ApprovalsPage() {
  const { user } = useAuth()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [approvals, setApprovals] = useState<ApprovalItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchApprovals(user.id).then((data) => {
      setApprovals(data)
      setLoading(false)
    })
  }, [user])

  const handleAction = async (approvalId: string, action: 'APPROVED' | 'REJECTED') => {
    await processApproval(approvalId, action, comment)
    setApprovals(approvals.filter((a) => a.id !== approvalId))
    setComment('')
    setExpanded(null)
  }

  if (loading) {
    return <div className="max-w-5xl mx-auto p-8 text-muted">Loading approvals...</div>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Approvals</h1>
        <p className="text-muted text-sm mt-1">Review and approve travel requests assigned to you</p>
      </div>

      {approvals.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <ClipboardCheck className="w-12 h-12 mx-auto text-success opacity-50 mb-3" />
          <p className="text-lg font-medium">All caught up!</p>
          <p className="text-muted text-sm mt-1">No pending approvals at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((apr) => (
            <div key={apr.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === apr.id ? null : apr.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-black/[0.01] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-accent font-mono text-sm">{apr.request.requestNumber}</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Level {apr.level}
                    </span>
                  </div>
                  <p className="font-medium mt-1">{apr.request.purpose}</p>
                  <p className="text-muted text-sm">
                    {apr.request.requester.name} &middot; {apr.request.destination} &middot; ${apr.request.estimatedTotal.toLocaleString()}
                  </p>
                </div>
                {expanded === apr.id ? (
                  <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted" />
                )}
              </button>

              {expanded === apr.id && (
                <div className="px-5 pb-5 border-t border-card-border pt-4 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted text-xs uppercase tracking-wider">Requester</p>
                      <p className="font-medium mt-1">{apr.request.requester.name}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs uppercase tracking-wider">Destination</p>
                      <p className="font-medium mt-1">{apr.request.destination}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs uppercase tracking-wider">Estimated Total</p>
                      <p className="font-medium mt-1">${apr.request.estimatedTotal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs uppercase tracking-wider">Approval Level</p>
                      <p className="font-medium mt-1">Level {apr.level} of 3</p>
                    </div>
                  </div>

                  {apr.request.estimates && apr.request.estimates.length > 0 && (
                    <div className="bg-background/50 rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">Expense Estimates</p>
                      <div className="space-y-2 text-sm">
                        {apr.request.estimates.map((exp) => (
                          <div key={exp.id} className="flex justify-between">
                            <span className="text-muted">
                              {exp.category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                              {exp.description ? ` - ${exp.description}` : ''}
                            </span>
                            <span>${exp.amount.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-medium border-t border-card-border pt-2 mt-2">
                          <span>Total</span>
                          <span>${apr.request.estimatedTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="relative flex-1">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted" />
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment (optional)..."
                        rows={2}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-card-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAction(apr.id, 'APPROVED')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-success hover:bg-success/90 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(apr.id, 'REJECTED')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-danger hover:bg-danger/90 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
