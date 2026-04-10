import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

// POST /api/users/sync - Find or create a user from WorkOS
export async function POST(request: NextRequest) {
  const { workosId, email, name } = await request.json()

  if (!email) {
    return Response.json({ error: 'email is required' }, { status: 400 })
  }

  // Try to find existing user by email
  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    // Create new user from WorkOS
    user = await prisma.user.create({
      data: {
        email,
        name: name || email,
        role: 'EMPLOYEE',
      },
    })
  }

  return Response.json(user)
}
