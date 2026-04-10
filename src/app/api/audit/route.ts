import { prisma } from '@/lib/db'

// GET /api/audit - get recent approvals as audit log
export async function GET() {
  const approvals = await prisma.approval.findMany({
    where: { decidedAt: { not: null } },
    include: {
      approver: { select: { name: true } },
      request: { select: { requestNumber: true } },
    },
    orderBy: { decidedAt: 'desc' },
    take: 50,
  })

  const auditLog = approvals.map((a) => ({
    id: a.id,
    timestamp: a.decidedAt,
    user: a.approver.name,
    action: a.status === 'APPROVED' ? 'Approved' : 'Rejected',
    target: a.request.requestNumber,
    details: `Level ${a.level} ${a.status.toLowerCase()}${a.comments ? ` - ${a.comments}` : ''}`,
  }))

  return Response.json(auditLog)
}
