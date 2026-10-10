import { useState } from 'react'
import CategoryFilter from './CategoryFilter.jsx'
import ProductCard from './ProductCard.jsx'
import { ALL_CATEGORIES } from '../data/categories.js'
import { products } from '../data/products.js'
import { validateProducts } from '../data/validateProducts.js'

if (import.meta.env.DEV) {
  for (const problem of validateProducts(products)) {
    console.warn(`[products.js] ${problem}`)
  }
}

export default function ProductList() {
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const visibleProducts = category === ALL_CATEGORIES ? products : products.filter((product) => product.category === category)

  return (
    <>
      <CategoryFilter selected={category} onSelect={setCategory} />
      <div className="product-list">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
