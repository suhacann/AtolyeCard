import ProductImage from './ProductImage.jsx'

// Fiyat hatalı girilmişse "NaN ₺" yerine sade bir metin gösterilir.
const formatPrice = (price) =>
  Number.isFinite(price) ? `${new Intl.NumberFormat('tr-TR').format(price)} ₺` : 'Fiyat yakında'

export default function ProductCard({ product }) {
  const { emoji, name, price, description, inStock } = product

  return (
    <article className={inStock ? 'product-card' : 'product-card product-card--sold-out'}>
      <ProductImage emoji={emoji} alt={name} />
      <h3>{name}</h3>
      <p className="product-price">
        {formatPrice(price)}
        {!inStock && <span className="sold-out-badge">Tükendi</span>}
      </p>
      <p className="product-desc">{description}</p>
    </article>
  )
}
