const statusConfig: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-zinc-100 text-zinc-600' },
  PENDING_APPROVAL: { label: 'Pending Approval', color: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
  TRAVEL_COMPLETE: { label: 'Travel Complete', color: 'bg-blue-100 text-blue-700' },
  REIMBURSEMENT_PENDING: { label: 'Reimbursement Pending', color: 'bg-purple-100 text-purple-700' },
  REIMBURSEMENT_APPROVED: { label: 'Reimbursement Approved', color: 'bg-emerald-100 text-emerald-700' },
  AP_PROCESSING: { label: 'A/P Processing', color: 'bg-indigo-100 text-indigo-700' },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-zinc-100 text-zinc-500' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, color: 'bg-zinc-100 text-zinc-600' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
