import { prisma } from './prisma'
import { sendSMS } from './twilio'
import { sendWhatsAppMessage } from './interakt'
import { sendOrderConfirmationEmail } from './resend'

export async function sendOrderConfirmations(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { include: { notifications: true } },
      items: { include: { product: true } },
    },
  })
  if (!order) return

  const { user } = order
  const prefs = user.notifications
  const shortId = orderId.slice(-6).toUpperCase()
  const total = order.total

  const smsMsg = `Cloakyard: Order #${shortId} confirmed! Total: ₹${total/100}. Track: cloakyard.in/profile/orders/${orderId}`

  if (!prefs || prefs.smsEnabled) {
    await sendSMS(user.phone, smsMsg)
  }

  if (!prefs || prefs.whatsappEnabled) {
    await sendWhatsAppMessage(user.phone, 'order_placed', [
      user.name ?? 'there',
      shortId,
      `₹${(total/100).toLocaleString('en-IN')}`,
      `cloakyard.in/profile/orders/${orderId}`,
    ])
  }

  if (user.email && (!prefs || prefs.emailEnabled)) {
    await sendOrderConfirmationEmail(
      user.email,
      user.name ?? '',
      orderId,
      total,
      order.items.map(i => ({
        name: i.product.name,
        size: i.size,
        colour: i.colour,
        quantity: i.quantity,
        price: i.price,
      }))
    )
  }
}

export async function sendOrderShippedNotifications(orderId: string, trackingId?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { include: { notifications: true } } },
  })
  if (!order) return

  const { user } = order
  const prefs = user.notifications
  const shortId = orderId.slice(-6).toUpperCase()

  let smsMsg = `Cloakyard: Great news! Order #${shortId} has shipped.`
  if (trackingId) smsMsg += ` Track: ${trackingId}`
  
  if (!prefs || prefs.smsEnabled) {
    await sendSMS(user.phone, smsMsg)
  }

  // Assuming interakt and resend have equivalent shipped templates, we could call them here too
  // if (!prefs || prefs.whatsappEnabled) await sendWhatsAppMessage(...)
}
