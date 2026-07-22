/**
 * WooCommerce REST API Client configuration
 */

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_STORE_URL || 'https://your-hostinger-site.com';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

/**
 * Basic fetch wrapper for WooCommerce REST API
 */
export async function fetchWooCommerce(endpoint: string, options: RequestInit = {}) {
  // In a real application, you'd use OAuth 1.0a or Basic Auth over HTTPS
  const authString = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${authString}`
  };

  const response = await fetch(`${WOOCOMMERCE_URL}/wp-json/wc/v3/${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    console.error('WooCommerce API Error:', response.statusText);
    return null;
  }

  return response.json();
}
