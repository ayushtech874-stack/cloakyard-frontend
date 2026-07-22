export async function sendWhatsAppMessage(
  phone: string,
  templateName: string,
  variables: string[]
) {
  try {
    await fetch('https://api.interakt.ai/v1/public/message/', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${process.env.INTERAKT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countryCode: '+91',
        phoneNumber: phone,
        callbackData: 'order_update',
        type: 'Template',
        template: {
          name: templateName,
          languageCode: 'en',
          bodyValues: variables,
        },
      }),
    })
  } catch (error) {
    console.error('Interakt error:', error)
  }
}
