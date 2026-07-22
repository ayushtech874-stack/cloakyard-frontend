import twilio from 'twilio'

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!)

export async function sendOTP(phone: string, otp: string) {
  try {
    await client.messages.create({
      body: `Your Cloakyard OTP is ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: `+91${phone}`,
    })
  } catch (error) {
    console.error('Twilio error:', error)
    throw new Error('Failed to send OTP')
  }
}

export async function sendSMS(phone: string, message: string) {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: `+91${phone}`,
    })
  } catch (error) {
    console.error('Twilio SMS error:', error)
  }
}
