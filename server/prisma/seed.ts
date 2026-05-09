import { PrismaClient, Role, ProjectStatus, TaskStatus, Priority } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? '' })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.task.deleteMany()
  await prisma.projectMember.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  const hash = (pw: string) => bcrypt.hashSync(pw, 12)

  const org = await prisma.organization.create({
    data: { name: 'Task Manager Dev', inviteCode: 'task2026' },
  })

  const admin = await prisma.user.create({
    data: { name: 'Yugal Kaushik', email: 'yugal@taskmanager.dev', password: hash('Yugal1234'), role: Role.ADMIN, orgId: org.id },
  })
  const manager = await prisma.user.create({
    data: { name: 'Tina Sharma', email: 'tina@taskmanager.dev', password: hash('Tina1234'), role: Role.MANAGER, orgId: org.id },
  })
  const member1 = await prisma.user.create({
    data: { name: 'Akash Mehta', email: 'akash@taskmanager.dev', password: hash('Akash1234'), role: Role.MEMBER, orgId: org.id },
  })
  const member2 = await prisma.user.create({
    data: { name: 'Shubham Gupta', email: 'shubham@taskmanager.dev', password: hash('Shubham1234'), role: Role.MEMBER, orgId: org.id },
  })
  const member3 = await prisma.user.create({
    data: { name: 'Neha Singh', email: 'neha@taskmanager.dev', password: hash('Neha1234'), role: Role.MEMBER, orgId: org.id },
  })
  const member4 = await prisma.user.create({
    data: { name: 'Pooja Patil', email: 'pooja@taskmanager.dev', password: hash('Pooja1234'), role: Role.MEMBER, orgId: org.id },
  })

  const project1 = await prisma.project.create({
    data: { name: 'Dashboard Cleanup', description: 'Keep the dashboard simple, fast, and easier to scan.', status: ProjectStatus.ACTIVE, ownerId: manager.id, orgId: org.id },
  })
  const project2 = await prisma.project.create({
    data: { name: 'Task Filters and Search', description: 'Add basic filters, search, and empty states for tasks.', status: ProjectStatus.ACTIVE, ownerId: admin.id, orgId: org.id },
  })
  const project3 = await prisma.project.create({
    data: { name: 'API and Auth Improvements', description: 'Handle login, validation, and a few missing API edge cases.', status: ProjectStatus.ACTIVE, ownerId: manager.id, orgId: org.id },
  })

  await prisma.projectMember.createMany({
    data: [
      { projectId: project1.id, userId: admin.id },
      { projectId: project1.id, userId: manager.id },
      { projectId: project1.id, userId: member1.id },
      { projectId: project1.id, userId: member2.id },
      { projectId: project2.id, userId: admin.id },
      { projectId: project2.id, userId: manager.id },
      { projectId: project2.id, userId: member2.id },
      { projectId: project2.id, userId: member3.id },
      { projectId: project2.id, userId: member4.id },
      { projectId: project3.id, userId: admin.id },
      { projectId: project3.id, userId: manager.id },
      { projectId: project3.id, userId: member1.id },
      { projectId: project3.id, userId: member3.id },
    ],
  })

  const yesterday = new Date(Date.now() - 86400000)
  const nextWeek = new Date(Date.now() + 7 * 86400000)
  const lastWeek = new Date(Date.now() - 7 * 86400000)

  await prisma.task.createMany({
    data: [
      { title: 'Fix dashboard card spacing', projectId: project1.id, assigneeId: member1.id, status: TaskStatus.DONE, priority: Priority.MEDIUM, dueDate: lastWeek, doneAt: lastWeek },
      { title: 'Reduce sidebar width on mobile', projectId: project1.id, assigneeId: member2.id, status: TaskStatus.IN_PROGRESS, priority: Priority.MEDIUM, dueDate: nextWeek },
      { title: 'Add task search input', projectId: project2.id, assigneeId: member3.id, status: TaskStatus.TODO, priority: Priority.HIGH, dueDate: nextWeek },
      { title: 'Create empty state for no results', projectId: project2.id, assigneeId: member4.id, status: TaskStatus.IN_REVIEW, priority: Priority.LOW, dueDate: yesterday },
      { title: 'Validate registration form properly', projectId: project3.id, assigneeId: admin.id, status: TaskStatus.DONE, priority: Priority.HIGH, dueDate: lastWeek, doneAt: lastWeek },
      { title: 'Handle duplicate org name error', projectId: project3.id, assigneeId: manager.id, status: TaskStatus.IN_PROGRESS, priority: Priority.HIGH, dueDate: nextWeek },
      { title: 'Add API test for login failure', projectId: project3.id, assigneeId: member2.id, status: TaskStatus.TODO, priority: Priority.MEDIUM, dueDate: nextWeek },
      { title: 'Check due date formatting in UI', projectId: project1.id, assigneeId: member4.id, status: TaskStatus.TODO, priority: Priority.LOW, dueDate: yesterday },
    ],
  })

  console.log('Seed complete. Org invite code: task2026')
  console.log('Login details:')
  console.log('Yugal Kaushik (ADMIN) - yugal@taskmanager.dev / Yugal1234')
  console.log('Tina Sharma (MANAGER) - tina@taskmanager.dev / Tina1234')
  console.log('Akash Mehta (MEMBER) - akash@taskmanager.dev / Akash1234')
  console.log('Shubham Gupta (MEMBER) - shubham@taskmanager.dev / Shubham1234')
  console.log('Neha Singh (MEMBER) - neha@taskmanager.dev / Neha1234')
  console.log('Pooja Patil (MEMBER) - pooja@taskmanager.dev / Pooja1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())