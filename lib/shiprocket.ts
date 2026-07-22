let shiprocketToken: string | null = null
let tokenExpiry: number | null = null

export async function getShiprocketToken(): Promise<string> {
  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken
  }
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })
  const data = await res.json()
  shiprocketToken = data.token
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000 // 9 days
  return data.token
}

export async function checkPincode(pincode: string) {
  const token = await getShiprocketToken()
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${process.env.SHIPROCKET_WAREHOUSE_PINCODE}&delivery_postcode=${pincode}&weight=0.5&cod=0`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return {
    serviceable: data.status === 200,
    etaDays: data.data?.available_courier_companies?.[0]?.estimated_delivery_days ?? null,
  }
}

export async function trackOrder(awbCode: string) {
  const token = await getShiprocketToken()
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return data.tracking_data
}
