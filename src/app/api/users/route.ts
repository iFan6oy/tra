import { prisma } from '@/lib/db'

// GET /api/users - list all users
export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
  })

  return Response.json(users)
}
