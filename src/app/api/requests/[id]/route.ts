import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

// GET /api/requests/[id] - get single request with all relations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const travelRequest = await prisma.travelRequest.findUnique({
    where: { id },
    include: {
      requester: { select: { id: true, name: true, email: true, role: true, department: true } },
      estimates: { include: { glAccount: true } },
      actuals: { include: { glAccount: true } },
      approvals: {
        include: { approver: { select: { id: true, name: true, email: true } } },
        orderBy: { level: 'asc' },
      },
    },
  })

  if (!travelRequest) {
    return Response.json({ error: 'Request not found' }, { status: 404 })
  }

  return Response.json(travelRequest)
}

// PATCH /api/requests/[id] - update a request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const updated = await prisma.travelRequest.update({
    where: { id },
    data: body,
    include: {
      requester: { select: { id: true, name: true, email: true } },
    },
  })

  return Response.json(updated)
}
