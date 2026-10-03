// Webhook payload'ları. Alan adları ve sırası atolyekart-standartlari skill'indeki sözleşmeyle birebir aynıdır;
// alan eklemeden ya da çıkarmadan önce skill'i güncelleyin.
const SOURCE = 'atolyekart-web'

export function buildOrderPayload(product, form) {
  return {
    event: 'order_created',
    name: form.name.trim(),
    productId: product.id,
    productName: product.name,
    phone: form.phone.trim(),
    email: form.email.trim(),
    quantity: Math.max(1, Math.floor(Number(form.quantity)) || 1),
    source: SOURCE,
  }
}

export function buildStockNotificationPayload(product, form) {
  return {
    event: 'stock_notification_requested',
    name: form.name.trim(),
    productId: product.id,
    productName: product.name,
    email: form.email.trim(),
    source: SOURCE,
  }
}
