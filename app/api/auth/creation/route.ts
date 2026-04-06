import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // Protocol: Always handle missing sessions with a redirect to login or home
    if (!user || !user.id) {
      return NextResponse.redirect(process.env.KINDE_SITE_URL || "http://localhost:3000");
    }

    // Check for existing user
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    // Create user if they don't exist
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          FirstName: user.given_name ?? "",
          // Industry Standard: You can add more default fields here
        },
      });
    }

    // INDUSTRY PROTOCOL: Never return raw JSON to the user's browser during a redirect flow.
    // Redirect the user to the "success" page (Home or Dashboard)
    return NextResponse.redirect(process.env.KINDE_SITE_URL || "http://localhost:3000");

  } catch (e) {
    console.error("Critical Auth Sync Failure:", e);
    // Redirect to an error page or home instead of showing a JSON error
    return NextResponse.redirect(`${process.env.KINDE_SITE_URL}?error=sync_failed`);
  }
}