import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

// GET /api/requests - list all requests (optionally filter by userId)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')

  const where: Record<string, unknown> = {}
  if (userId) where.requesterId = userId
  if (status && status !== 'ALL') where.status = status

  const requests = await prisma.travelRequest.findMany({
    where,
    include: {
      requester: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(requests)
}

// POST /api/requests - create a new travel request
export async function POST(request: NextRequest) {
  const body = await request.json()

  const { purpose, destination, departureDate, returnDate, notes, requesterId, estimates, submit } = body

  const estimatedTotal = estimates?.reduce((sum: number, e: { amount: number }) => sum + (e.amount || 0), 0) || 0

  const travelRequest = await prisma.travelRequest.create({
    data: {
      purpose,
      destination,
      departureDate: new Date(departureDate),
      returnDate: new Date(returnDate),
      notes,
      requesterId,
      estimatedTotal,
      status: submit ? 'PENDING_APPROVAL' : 'DRAFT',
      currentApproverLevel: submit ? 1 : 0,
      requestNumber: `TR-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      estimates: estimates?.length ? {
        create: estimates.map((e: { category: string; description: string; amount: number }) => ({
          type: 'ESTIMATE' as const,
          phase: 'PRE_TRIP' as const,
          category: e.category,
          description: e.description,
          amount: e.amount,
        })),
      } : undefined,
    },
    include: {
      estimates: true,
      requester: { select: { id: true, name: true, email: true } },
    },
  })

  return Response.json(travelRequest, { status: 201 })
}
