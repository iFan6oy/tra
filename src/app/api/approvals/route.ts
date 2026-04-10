import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

// GET /api/approvals?approverId=xxx - get pending approvals for a user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const approverId = searchParams.get('approverId')

  if (!approverId) {
    return Response.json({ error: 'approverId is required' }, { status: 400 })
  }

  const approvals = await prisma.approval.findMany({
    where: {
      approverId,
      status: 'PENDING',
    },
    include: {
      request: {
        include: {
          requester: { select: { id: true, name: true, email: true } },
          estimates: true,
        },
      },
      approver: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(approvals)
}

// POST /api/approvals - process an approval (approve/reject)
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { approvalId, action, comments } = body

  if (!approvalId || !action) {
    return Response.json({ error: 'approvalId and action are required' }, { status: 400 })
  }

  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: { request: true },
  })

  if (!approval) {
    return Response.json({ error: 'Approval not found' }, { status: 404 })
  }

  // Update approval
  const updated = await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status: action,
      comments,
      decidedAt: new Date(),
    },
  })

  // If approved, advance the request's currentApproverLevel
  if (action === 'APPROVED') {
    const nextLevel = approval.level + 1
    const maxLevel = 3 // configurable

    await prisma.travelRequest.update({
      where: { id: approval.requestId },
      data: {
        currentApproverLevel: nextLevel,
        status: nextLevel > maxLevel ? 'APPROVED' : 'PENDING_APPROVAL',
      },
    })
  } else if (action === 'REJECTED') {
    await prisma.travelRequest.update({
      where: { id: approval.requestId },
      data: { status: 'REJECTED' },
    })
  }

  return Response.json(updated)
}
