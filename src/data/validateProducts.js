// products.js'deki yazım hatalarını bulur ve her biri için okunabilir bir mesaj döndürür.
// Geliştirme sırasında ProductList bu mesajları konsola yazar.
const CATEGORIES = ['kuksa', 'kasik']

export function validateProducts(products) {
  const problems = []
  const seenIds = new Set()

  products.forEach((product, index) => {
    const label = product.name || `${index + 1}. ürün`

    if (!product.id) {
      problems.push(`${label}: id eksik`)
    } else if (seenIds.has(product.id)) {
      problems.push(`${label}: id "${product.id}" başka bir üründe de kullanılmış`)
    } else {
      seenIds.add(product.id)
    }

    if (!product.name) problems.push(`${label}: name eksik`)
    if (!product.description) problems.push(`${label}: description eksik`)
    if (!product.emoji) problems.push(`${label}: emoji eksik`)

    if (typeof product.price !== 'number' || !Number.isFinite(product.price)) {
      problems.push(`${label}: price sayı olmalı (şu an: ${JSON.stringify(product.price)})`)
    }

    if (!CATEGORIES.includes(product.category)) {
      problems.push(`${label}: category "${product.category}" geçersiz (${CATEGORIES.join(' | ')} olmalı)`)
    }

    if (typeof product.inStock !== 'boolean') {
      problems.push(`${label}: inStock true ya da false olmalı`)
    }
  })

  return problems
}
