import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { id, email, given_name, family_name } = await request.json();

    if (!id || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: { email, FirstName: given_name ?? "", LastName: family_name ?? "" },
      create: { id, email, FirstName: given_name ?? "", LastName: family_name ?? "" },
    });

    return NextResponse.json(user);
  } catch (e) {
    console.error("User sync error:", e);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}