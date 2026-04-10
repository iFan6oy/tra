import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

// GET /api/stats?userId=xxx - dashboard stats
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  const [totalRequests, pendingApproval, paidRequests, allRequests] = await Promise.all([
    prisma.travelRequest.count(userId ? { where: { requesterId: userId } } : undefined),
    prisma.approval.count({ where: { status: 'PENDING', ...(userId ? { approverId: userId } : {}) } }),
    prisma.travelRequest.findMany({
      where: { status: 'PAID', ...(userId ? { requesterId: userId } : {}) },
      select: { actualTotal: true },
    }),
    prisma.travelRequest.findMany({
      where: userId ? { requesterId: userId } : {},
      select: { status: true },
    }),
  ])

  const totalSpent = paidRequests.reduce((sum, r) => sum + r.actualTotal, 0)

  // Pipeline counts
  const pipeline = {
    draft: allRequests.filter(r => r.status === 'DRAFT').length,
    pending: allRequests.filter(r => r.status === 'PENDING_APPROVAL').length,
    approved: allRequests.filter(r => r.status === 'APPROVED').length,
    traveling: allRequests.filter(r => r.status === 'TRAVEL_COMPLETE').length,
    reimbursement: allRequests.filter(r => ['REIMBURSEMENT_PENDING', 'REIMBURSEMENT_APPROVED'].includes(r.status)).length,
    ap: allRequests.filter(r => r.status === 'AP_PROCESSING').length,
    paid: allRequests.filter(r => r.status === 'PAID').length,
  }

  return Response.json({
    totalRequests,
    pendingApproval,
    totalSpent,
    pipeline,
  })
}
