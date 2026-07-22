import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendOrderConfirmationEmail(
  email: string,
  userName: string,
  orderId: string,
  total: number,
  items: { name: string; size: string; colour: string; quantity: number; price: number }[]
) {
  const itemsHTML = items.map(i =>
    `<tr style="border-bottom:1px solid #222">
      <td style="padding:12px 0;color:#f5f0e8;font-family:'DM Sans',sans-serif">${i.name} — ${i.colour} / ${i.size}</td>
      <td style="padding:12px 0;color:#f5f0e8;font-family:'DM Sans',sans-serif;text-align:right">x${i.quantity} — ₹${(i.price/100).toLocaleString('en-IN')}</td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from: 'Cloakyard <orders@cloakyard.in>',
    to: email,
    subject: `Order confirmed — #${orderId.slice(-6).toUpperCase()}`,
    html: `
      <div style="background:#0a0a0a;padding:40px;max-width:560px;margin:0 auto;font-family:'DM Sans',sans-serif">
        <h1 style="font-family:'Bebas Neue',sans-serif;font-size:48px;color:#C08B2C;margin:0 0 8px">CLOAKYARD</h1>
        <p style="color:#8a8580;font-size:13px;margin:0 0 32px">Order Confirmation</p>
        <h2 style="color:#f5f0e8;font-size:20px;margin:0 0 8px">Hey ${userName || 'there'}, your order is confirmed.</h2>
        <p style="color:#8a8580;margin:0 0 32px">Order #${orderId.slice(-6).toUpperCase()}</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">${itemsHTML}</table>
        <div style="border-top:1px solid #C08B2C;padding-top:16px;margin-bottom:32px">
          <div style="display:flex;justify-content:space-between">
            <span style="color:#f5f0e8;font-size:18px;font-weight:600">Total</span>
            <span style="color:#C08B2C;font-size:18px;font-weight:600">₹${(total/100).toLocaleString('en-IN')}</span>
          </div>
        </div>
        <a href="https://cloakyard.in/profile/orders/${orderId}" style="background:#C08B2C;color:#0a0a0a;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Track your order</a>
        <p style="color:#444;font-size:12px;margin-top:40px">© 2024 Cloakyard. All rights reserved.</p>
      </div>
    `,
  })
}
