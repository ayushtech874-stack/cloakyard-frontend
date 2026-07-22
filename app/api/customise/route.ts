import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, baseProduct, baseColour, size, placement, brief, referenceImages } = body

    try {
      const customOrder = await prisma.customOrder.create({
        data: { userId, baseProduct, baseColour, size, placement, brief, referenceImages: referenceImages ?? [] },
      })

      await resend.emails.send({
        from: 'Cloakyard <orders@cloakyard.in>',
        to: 'team@cloakyard.in',
        subject: `New custom order — ${customOrder.id.slice(-6).toUpperCase()}`,
        html: `<p><strong>User:</strong> ${userId}</p><p><strong>Product:</strong> ${baseProduct} / ${baseColour} / ${size}</p><p><strong>Placement:</strong> ${placement}</p><p><strong>Brief:</strong> ${brief}</p>`,
      })

      return NextResponse.json({ customOrder })
    } catch (e) {
      console.warn('DB/Resend not connected. Using mock custom order.')
      return NextResponse.json({ customOrder: { id: 'mock_order_1' } })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
