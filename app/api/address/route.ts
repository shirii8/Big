import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export async function GET() {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(addresses)
  } catch (e) {
    console.error('[address GET]', e)
    return NextResponse.json([]) // graceful fallback — UI uses localStorage
  }
}

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { line1, line2, city, state, postalCode, country, phone, localId } = body

    if (!line1 || !city || !state || !postalCode || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure user exists in DB before creating address (FK constraint)
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email ?? '',
        firstName: user.given_name ?? null,
        lastName: user.family_name ?? null,
      },
      create: {
        id: user.id,
        email: user.email ?? '',
        firstName: user.given_name ?? null,
        lastName: user.family_name ?? null,
      },
    })

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        line1: line1.trim(),
        line2: line2?.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
        phone: phone?.trim() || null,
      },
    })

    // Return with localId so client can replace the temp ID
    return NextResponse.json({ ...address, localId: localId ?? null }, { status: 201 })
  } catch (e) {
    console.error('[address POST]', e)
    // Return db_failed so client knows to keep localStorage version
    return NextResponse.json({ error: 'db_failed', details: String(e) }, { status: 500 })
  }
}

// // app/api/address/route.ts
// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/db'
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

// export async function GET() {
//   const { getUser } = getKindeServerSession()
//   const user = await getUser()
//   if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

//   try {
//     const addresses = await prisma.address.findMany({
//       where: { userId: user.id },
//       orderBy: { createdAt: 'desc' },
//     })
//     return NextResponse.json(addresses)
//   } catch (e) {
//     console.error('[address GET]', e)
//     return NextResponse.json([]) // return empty so UI falls back to localStorage
//   }
// }

// export async function POST(req: Request) {
//   const { getUser } = getKindeServerSession()
//   const user = await getUser()
//   if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

//   try {
//     const { line1, line2, city, state, postalCode, country, phone, localId } = await req.json()

//     if (!line1 || !city || !state || !postalCode || !country) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
//     }

//     // Always upsert user first
//     await prisma.user.upsert({
//       where: { id: user.id },
//       update: { email: user.email ?? '', firstName: user.given_name ?? null, lastName: user.family_name ?? null },
//       create: { id: user.id, email: user.email ?? '', firstName: user.given_name ?? null, lastName: user.family_name ?? null },
//     })

//     const address = await prisma.address.create({
//       data: { userId: user.id, line1, line2: line2 || null, city, state, postalCode, country, phone: phone || null },
//     })

//     // Return with localId so client can match and replace it
//     return NextResponse.json({ ...address, localId }, { status: 201 })
//   } catch (e) {
//     console.error('[address POST]', e)
//     // Don't fail — return a synthetic response so checkout can still proceed
//     return NextResponse.json({ error: 'db_failed' }, { status: 500 })
//   }
// }

// // // app/api/address/route.ts
// // import { NextResponse } from 'next/server'
// // import { prisma } from '@/lib/db'
// // import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

// // export async function GET() {
// //   const { getUser } = getKindeServerSession()
// //   const user = await getUser()
// //   if (!user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// //   const addresses = await prisma.address.findMany({
// //     where: { userId: user.id },
// //     orderBy: { createdAt: 'desc' },
// //   })

// //   return NextResponse.json(addresses)  // ← was OUTSIDE the function in your paste
// // }

// // export async function POST(req: Request) {
// //   const { getUser } = getKindeServerSession()
// //   const user = await getUser()
// //   if (!user?.id || !user.email) return NextResponse.json({ error: 'Unauthorized or email missing' }, { status: 401 })

// //   try {
// //     const { line1, line2, city, state, postalCode, country, phone } = await req.json()

// //     if (!line1 || !city || !state || !postalCode || !country) {
// //       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
// //     }

// //     // Upsert user so Kinde users always exist in DB before address creation
// //     await prisma.user.upsert({
// //       where: { id: user.id },
// //       update: {
// //         email: user.email,
// //         firstName: user.given_name ?? null,
// //         lastName: user.family_name ?? null,
// //       },
// //       create: {
// //         id: user.id,
// //         email: user.email,
// //         firstName: user.given_name ?? null,
// //         lastName: user.family_name ?? null,
// //       },
// //     })

// //     const address = await prisma.address.create({
// //       data: {
// //         userId: user.id,
// //         line1,
// //         line2: line2 || null,
// //         city,
// //         state,
// //         postalCode,
// //         country,
// //         phone: phone || null,
// //       },
// //     })

// //     return NextResponse.json(address, { status: 201 })
// //   } catch (e) {
// //     console.error('[address POST]', e)
// //     return NextResponse.json({ error: 'Failed to save address' }, { status: 500 })
// //   }
// // }