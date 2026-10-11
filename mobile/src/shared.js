// Web sitesiyle ortak kod tek kaynaktan gelir: ürünler, fiyat biçimi, kategoriler,
// payload sözleşmesi ve form kuralları ../src/data altında. Mobilde kopyası tutulmaz.
export { products } from '../../src/data/products.js'
export { formatPrice } from '../../src/data/formatPrice.js'
export { CATEGORIES, CATEGORY_LABELS, ALL_CATEGORIES, ALL_CATEGORIES_LABEL } from '../../src/data/categories.js'
export { buildOrderPayload, buildStockNotificationPayload } from '../../src/data/webhookPayloads.js'
export { EMAIL_PATTERN, PHONE_PATTERN, MAX_LENGTH, MAX_QUANTITY } from '../../src/data/formRules.js'
export { SITE_URL } from '../../src/data/site.js'
export { validateProducts } from '../../src/data/validateProducts.js'
