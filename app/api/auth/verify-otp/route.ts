import { NextResponse } from 'next/server'
import { fetchWooCommerce } from '@/lib/woocommerce'

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json()
    
    if (!phone || phone.length !== 10 || !otp) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // SIMULATED OTP VERIFICATION (Hardcoded to 123456)
    if (otp !== '123456') {
      return NextResponse.json({ error: 'Invalid OTP code' }, { status: 401 })
    }

    // 1. Search WooCommerce for a customer with this phone number in billing
    // WooCommerce REST API allows searching customers by email, but not directly by phone easily.
    // Instead, we might need to search all or rely on a specific username format (e.g. phone number)
    const username = `user_${phone}`
    const existingCustomers = await fetchWooCommerce(`customers?search=${username}`)
    
    let customer = existingCustomers && existingCustomers.length > 0 ? existingCustomers[0] : null;

    if (!customer) {
      // 2. Create the customer in WooCommerce if they don't exist
      const createData = {
        email: `${phone}@cloakyard.in`, // dummy email required by WC
        first_name: '',
        last_name: '',
        username: username,
        billing: {
          phone: phone
        },
        meta_data: [
          { key: 'phone', value: phone },
          { key: 'username', value: `cloak_${phone.substring(0,5)}` }
        ]
      }
      
      const res = await fetchWooCommerce('customers', {
        method: 'POST',
        body: JSON.stringify(createData)
      });
      
      if (res && res.id) {
        customer = res;
      } else {
        throw new Error('Failed to create customer in WooCommerce');
      }
    }

    // Prepare user object for the frontend store
    const user = {
      id: customer.id.toString(),
      phone: phone,
      name: customer.first_name ? `${customer.first_name} ${customer.last_name}`.trim() : null,
      username: customer.meta_data?.find((m:any) => m.key === 'username')?.value || null,
      dob: customer.meta_data?.find((m:any) => m.key === 'dob')?.value || null,
      altPhone: customer.meta_data?.find((m:any) => m.key === 'alt_phone')?.value || null,
      avatar: customer.meta_data?.find((m:any) => m.key === 'avatar_url')?.value || null,
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("OTP Verification Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
