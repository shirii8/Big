import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id) {
      return NextResponse.redirect(process.env.KINDE_SITE_URL ?? "http://localhost:3000")
    }

    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email!,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
      },
      create: {
        id: user.id,
        email: user.email!,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
      },
    })

    return NextResponse.redirect(process.env.KINDE_SITE_URL ?? "http://localhost:3000")
  } catch (e) {
    console.error("[auth/creation]", e)
    return NextResponse.redirect(
      `${process.env.KINDE_SITE_URL ?? "http://localhost:3000"}?error=sync_failed`
    )
  }
}