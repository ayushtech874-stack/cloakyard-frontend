import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export async function POST(req: Request) {
  try {
    const { userId, orderId, subject, message, photoUrl } = await req.json()
    const ticket = await prisma.supportTicket.create({
      data: { userId, orderId, subject, message, photoUrl },
    })
    await resend.emails.send({
      from: 'Cloakyard Support <support@cloakyard.in>',
      to: 'team@cloakyard.in',
      subject: `[Ticket #${ticket.id.slice(-6).toUpperCase()}] ${subject}`,
      html: `<p><strong>User:</strong> ${userId}</p>${orderId ? `<p><strong>Order:</strong> ${orderId}</p>` : ''}<p>${message}</p>`,
    })
    return NextResponse.json({ ticketId: ticket.id })
  } catch {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
