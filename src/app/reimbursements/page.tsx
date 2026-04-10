'use client'

import { Receipt, Upload, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { mockRequests } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'

export default function ReimbursementsPage() {
  // Show requests that are ready for post-trip expense entry
  const reimbursable = mockRequests.filter((r) =>
    ['APPROVED', 'TRAVEL_COMPLETE', 'REIMBURSEMENT_PENDING', 'REIMBURSEMENT_APPROVED', 'AP_PROCESSING', 'PAID'].includes(r.status)
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reimbursements</h1>
        <p className="text-muted text-sm mt-1">Submit actual expenses after travel is complete</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-muted text-xs">Pending Submission</p>
              <p className="text-xl font-bold">2</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Upload className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-muted text-xs">In Processing</p>
              <p className="text-xl font-bold">1</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-muted text-xs">Total Reimbursed</p>
              <p className="text-xl font-bold">$3,215.50</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reimbursable Requests */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-card-border">
          <h2 className="font-semibold">Travel Requests</h2>
        </div>
        <div className="divide-y divide-card-border">
          {reimbursable.map((req) => {
            const needsEntry = ['APPROVED', 'TRAVEL_COMPLETE'].includes(req.status)
            return (
              <div key={req.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-accent font-mono text-sm">{req.requestNumber}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="font-medium text-sm mt-1">{req.purpose}</p>
                  <p className="text-muted text-xs">{req.destination} &middot; {req.departureDate} - {req.returnDate}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm">
                    <span className="text-muted">Est:</span> ${req.estimatedTotal.toLocaleString()}
                    {req.actualTotal > 0 && (
                      <span className="ml-3"><span className="text-muted">Act:</span> ${req.actualTotal.toLocaleString()}</span>
                    )}
                  </p>
                  {needsEntry ? (
                    <Link
                      href={`/reimbursements/${req.id}`}
                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      Enter Actuals
                    </Link>
                  ) : (
                    <Link
                      href={`/reimbursements/${req.id}`}
                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 border border-card-border rounded-lg text-xs font-medium hover:bg-card-border/50 transition-colors"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
