// app/api/payments/upi/upload-screenshot/route.ts
// Uploads payment screenshot to Cloudinary and saves URL to Order

import { NextRequest, NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { PrismaClient } from '@/generated/prisma'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const orderId = formData.get('orderId') as string | null

    if (!file || !orderId) {
      return NextResponse.json({ error: 'Missing file or orderId' }, { status: 400 })
    }

    // Verify this order belongs to the user
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
    })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Convert File to Buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'tessch-payment-proofs',
          public_id: `order-${orderId.slice(0, 8)}-${Date.now()}`,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) reject(error ?? new Error('Upload failed'))
          else resolve(result as { secure_url: string })
        }
      ).end(buffer)
    })

    const screenshotUrl = uploadResult.secure_url

    // Save URL to order immediately so it's not lost
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentScreenshot: screenshotUrl },
    })

    return NextResponse.json({ screenshotUrl })
  } catch (error) {
    console.error('[upload-screenshot]', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}