import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Clean existing data
  await prisma.approval.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.travelRequest.deleteMany()
  await prisma.gLAccount.deleteMany()
  await prisma.department.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const admin = await prisma.user.create({
    data: { email: 'admin@company.com', name: 'Admin User', role: 'ADMIN', department: 'IT', title: 'System Administrator' },
  })
  const manager = await prisma.user.create({
    data: { email: 'john@company.com', name: 'John Doe', role: 'MANAGER', department: 'Engineering', title: 'Engineering Manager' },
  })
  const finance = await prisma.user.create({
    data: { email: 'lisa@company.com', name: 'Lisa Park', role: 'FINANCE', department: 'Finance', title: 'Finance Director' },
  })
  const sarah = await prisma.user.create({
    data: { email: 'sarah@company.com', name: 'Sarah Chen', role: 'EMPLOYEE', department: 'Sales', title: 'Account Executive' },
  })
  const mike = await prisma.user.create({
    data: { email: 'mike@company.com', name: 'Mike Johnson', role: 'EMPLOYEE', department: 'Engineering', title: 'Software Engineer' },
  })

  // Create departments
  const engDept = await prisma.department.create({
    data: { name: 'Engineering', code: 'ENG', managerId: manager.id },
  })
  const salesDept = await prisma.department.create({
    data: { name: 'Sales', code: 'SAL' },
  })
  const finDept = await prisma.department.create({
    data: { name: 'Finance', code: 'FIN', managerId: finance.id },
  })

  // Create GL accounts
  const glTravel = await prisma.gLAccount.create({
    data: { code: '6100', name: 'Travel Expense', departmentId: engDept.id },
  })
  const glMeals = await prisma.gLAccount.create({
    data: { code: '6200', name: 'Meals & Entertainment', departmentId: engDept.id },
  })
  const glConf = await prisma.gLAccount.create({
    data: { code: '6300', name: 'Conference & Training', departmentId: engDept.id },
  })

  // Create travel requests
  const req1 = await prisma.travelRequest.create({
    data: {
      requestNumber: 'TR-2026-001',
      status: 'APPROVED',
      currentApproverLevel: 3,
      purpose: 'Annual DevOps Conference',
      destination: 'San Francisco, CA',
      departureDate: new Date('2026-04-15'),
      returnDate: new Date('2026-04-18'),
      requesterId: manager.id,
      estimatedTotal: 2850,
      actualTotal: 0,
    },
  })

  const req2 = await prisma.travelRequest.create({
    data: {
      requestNumber: 'TR-2026-002',
      status: 'PENDING_APPROVAL',
      currentApproverLevel: 1,
      purpose: 'Client Meeting - Q2 Review',
      destination: 'New York, NY',
      departureDate: new Date('2026-05-01'),
      returnDate: new Date('2026-05-03'),
      requesterId: manager.id,
      estimatedTotal: 1950,
      actualTotal: 0,
    },
  })

  const req3 = await prisma.travelRequest.create({
    data: {
      requestNumber: 'TR-2026-003',
      status: 'DRAFT',
      currentApproverLevel: 0,
      purpose: 'Team Offsite Planning',
      destination: 'Austin, TX',
      departureDate: new Date('2026-05-15'),
      returnDate: new Date('2026-05-17'),
      requesterId: manager.id,
      estimatedTotal: 1200,
      actualTotal: 0,
    },
  })

  const req4 = await prisma.travelRequest.create({
    data: {
      requestNumber: 'TR-2026-004',
      status: 'PAID',
      currentApproverLevel: 3,
      purpose: 'AWS re:Invent',
      destination: 'Las Vegas, NV',
      departureDate: new Date('2026-01-10'),
      returnDate: new Date('2026-01-14'),
      requesterId: manager.id,
      estimatedTotal: 3400,
      actualTotal: 3215.50,
    },
  })

  const req5 = await prisma.travelRequest.create({
    data: {
      requestNumber: 'TR-2026-005',
      status: 'REIMBURSEMENT_PENDING',
      currentApproverLevel: 2,
      purpose: 'Partner Summit',
      destination: 'Chicago, IL',
      departureDate: new Date('2026-03-05'),
      returnDate: new Date('2026-03-07'),
      requesterId: manager.id,
      estimatedTotal: 1800,
      actualTotal: 1725,
    },
  })

  // Requests from other users (for approvals)
  const req6 = await prisma.travelRequest.create({
    data: {
      requestNumber: 'TR-2026-010',
      status: 'PENDING_APPROVAL',
      currentApproverLevel: 1,
      purpose: 'Sales Kickoff - West Region',
      destination: 'Seattle, WA',
      departureDate: new Date('2026-04-20'),
      returnDate: new Date('2026-04-22'),
      requesterId: sarah.id,
      estimatedTotal: 2100,
    },
  })

  const req7 = await prisma.travelRequest.create({
    data: {
      requestNumber: 'TR-2026-011',
      status: 'PENDING_APPROVAL',
      currentApproverLevel: 2,
      purpose: 'Training Certification',
      destination: 'Denver, CO',
      departureDate: new Date('2026-05-10'),
      returnDate: new Date('2026-05-12'),
      requesterId: mike.id,
      estimatedTotal: 1450,
    },
  })

  const req8 = await prisma.travelRequest.create({
    data: {
      requestNumber: 'TR-2026-012',
      status: 'PENDING_APPROVAL',
      currentApproverLevel: 1,
      purpose: 'Board Presentation',
      destination: 'Boston, MA',
      departureDate: new Date('2026-05-05'),
      returnDate: new Date('2026-05-06'),
      requesterId: sarah.id,
      estimatedTotal: 3200,
    },
  })

  // Add expenses for req1
  await prisma.expense.createMany({
    data: [
      { type: 'ESTIMATE', phase: 'PRE_TRIP', description: 'Round-trip flight SFO', amount: 450, category: 'AIRFARE', estimateForId: req1.id, glAccountId: glTravel.id },
      { type: 'ESTIMATE', phase: 'PRE_TRIP', description: 'Hotel 3 nights', amount: 1200, category: 'HOTEL', estimateForId: req1.id, glAccountId: glTravel.id },
      { type: 'ESTIMATE', phase: 'PRE_TRIP', description: 'Meals per diem', amount: 300, category: 'MEALS', estimateForId: req1.id, glAccountId: glMeals.id },
      { type: 'ESTIMATE', phase: 'PRE_TRIP', description: 'Conference registration', amount: 700, category: 'REGISTRATION', estimateForId: req1.id, glAccountId: glConf.id },
      { type: 'ESTIMATE', phase: 'PRE_TRIP', description: 'Ground transport', amount: 200, category: 'GROUND_TRANSPORT', estimateForId: req1.id, glAccountId: glTravel.id },
    ],
  })

  // Add expenses for req4 (paid - has actuals)
  await prisma.expense.createMany({
    data: [
      { type: 'ACTUAL', phase: 'POST_TRIP', description: 'Flight to LAS', amount: 380, category: 'AIRFARE', actualForId: req4.id, glAccountId: glTravel.id },
      { type: 'ACTUAL', phase: 'POST_TRIP', description: 'Hotel 4 nights', amount: 1600, category: 'HOTEL', actualForId: req4.id, glAccountId: glTravel.id },
      { type: 'ACTUAL', phase: 'POST_TRIP', description: 'Meals', amount: 435.50, category: 'MEALS', actualForId: req4.id, glAccountId: glMeals.id },
      { type: 'ACTUAL', phase: 'POST_TRIP', description: 'Conference pass', amount: 600, category: 'REGISTRATION', actualForId: req4.id, glAccountId: glConf.id },
      { type: 'ACTUAL', phase: 'POST_TRIP', description: 'Uber/Lyft', amount: 200, category: 'GROUND_TRANSPORT', actualForId: req4.id, glAccountId: glTravel.id },
    ],
  })

  // Add approvals
  await prisma.approval.createMany({
    data: [
      // req1 fully approved
      { level: 1, status: 'APPROVED', approverId: manager.id, requestId: req1.id, decidedAt: new Date('2026-03-22') },
      { level: 2, status: 'APPROVED', approverId: finance.id, requestId: req1.id, decidedAt: new Date('2026-03-23') },
      { level: 3, status: 'APPROVED', approverId: admin.id, requestId: req1.id, decidedAt: new Date('2026-03-24') },
      // req2 level 1 pending
      { level: 1, status: 'PENDING', approverId: manager.id, requestId: req2.id },
      // req6 pending for manager
      { level: 1, status: 'PENDING', approverId: manager.id, requestId: req6.id },
      // req7 level 2 pending for finance
      { level: 1, status: 'APPROVED', approverId: manager.id, requestId: req7.id, decidedAt: new Date('2026-04-08') },
      { level: 2, status: 'PENDING', approverId: finance.id, requestId: req7.id },
      // req8 pending
      { level: 1, status: 'PENDING', approverId: manager.id, requestId: req8.id },
    ],
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
