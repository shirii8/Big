// import { NextResponse } from "next/server"
// import { auth } from "@/lib/auth"
// import { stripe } from "@/lib/stripe"
// import { prisma } from "@/lib/db"

// export async function POST() {
//   const session = await auth()
//   if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//   const cartItems = await prisma.cartItem.findMany({
//     where: { userId: session.user.id },
//     include: { product: true }
//   })

//   if (cartItems.length === 0) return NextResponse.json({ error: "Cart empty" }, { status: 400 })

//   const stripeSession = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: cartItems.map(item => ({
//       price_data: {
//         currency: 'inr',
//         product_data: { name: item.product.name },
//         unit_amount: item.product.price * 100,
//       },
//       quantity: item.qty,
//     })),
//     mode: 'payment',
//     success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
//     cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
//     metadata: { userId: session.user.id }
//   })

//   return NextResponse.json({ url: stripeSession.url })
// }