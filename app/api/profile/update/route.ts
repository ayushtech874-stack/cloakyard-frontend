import { NextResponse } from 'next/server'
import { fetchWooCommerce } from '@/lib/woocommerce'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { userId, firstName, lastName, altPhone, username, dob } = data
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Fetch current customer to check if DOB is already set
    const currentCustomer = await fetchWooCommerce(`customers/${userId}`)
    if (!currentCustomer || currentCustomer.error) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Check DOB immutability
    const existingDob = currentCustomer.meta_data?.find((m:any) => m.key === 'dob')?.value
    let finalDob = dob
    if (existingDob && dob && existingDob !== dob) {
      // Reject DOB change if it already exists
      return NextResponse.json({ error: 'Date of Birth cannot be changed once set' }, { status: 400 })
    } else if (existingDob) {
      finalDob = existingDob // keep existing if not provided
    }

    // 2. Prepare WooCommerce Update Payload
    const updateData: any = {
      first_name: firstName !== undefined ? firstName : currentCustomer.first_name,
      last_name: lastName !== undefined ? lastName : currentCustomer.last_name,
      meta_data: []
    }

    // Add metadata fields
    if (altPhone !== undefined) updateData.meta_data.push({ key: 'alt_phone', value: altPhone })
    if (username !== undefined) updateData.meta_data.push({ key: 'username', value: username })
    if (finalDob !== undefined) updateData.meta_data.push({ key: 'dob', value: finalDob })

    // 3. Send update to WooCommerce
    const updatedCustomer = await fetchWooCommerce(`customers/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    })

    if (!updatedCustomer || updatedCustomer.error) {
      throw new Error('Failed to update WooCommerce customer')
    }

    // Prepare updated user object for the frontend store
    const user = {
      id: updatedCustomer.id.toString(),
      phone: currentCustomer.billing?.phone || '',
      name: updatedCustomer.first_name ? `${updatedCustomer.first_name} ${updatedCustomer.last_name}`.trim() : null,
      username: updatedCustomer.meta_data?.find((m:any) => m.key === 'username')?.value || null,
      dob: updatedCustomer.meta_data?.find((m:any) => m.key === 'dob')?.value || null,
      altPhone: updatedCustomer.meta_data?.find((m:any) => m.key === 'alt_phone')?.value || null,
      avatar: updatedCustomer.meta_data?.find((m:any) => m.key === 'avatar_url')?.value || null,
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Profile Update Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
