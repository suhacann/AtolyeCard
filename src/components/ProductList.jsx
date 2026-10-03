import ProductCard from './ProductCard.jsx'
import { products } from '../data/products.js'
import { validateProducts } from '../data/validateProducts.js'

if (import.meta.env.DEV) {
  for (const problem of validateProducts(products)) {
    console.warn(`[products.js] ${problem}`)
  }
}

export default function ProductList() {
  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
