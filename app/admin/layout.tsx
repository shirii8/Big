import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
// FIX: Use central prisma export to avoid "too many connections" error
import { prisma } from '@/lib/db' 

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  // 1. Check if user is even logged into Kinde
  if (!user || !user.id) {
    redirect('/api/auth/login')
  }

  // 2. Check Database for Admin/Manager role
  const dbUser = await prisma.user.findUnique({ 
    where: { id: user.id },
    select: { role: true } // Optimization: only fetch the role column
  })

  // 3. Unauthorized access handler
  if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'MANAGER')) {
    console.error(`Unauthorized admin access attempt by: ${user.email}`)
    redirect('/')
  }

  return <>{children}</>
}