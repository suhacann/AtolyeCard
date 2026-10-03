import ProductImage from './ProductImage.jsx'
import OrderForm from './OrderForm.jsx'
import StockNotificationForm from './StockNotificationForm.jsx'
import { formatPrice } from '../data/formatPrice.js'
import { isWebhookConfigured } from '../data/sendWebhook.js'

export default function ProductCard({ product }) {
  const { name, price, description, inStock } = product

  return (
    <article className={inStock ? 'product-card' : 'product-card product-card--sold-out'}>
      <ProductImage product={product} />
      <h3>{name}</h3>
      <p className="product-card__price">
        {formatPrice(price)}
        {!inStock && <span className="product-card__badge">Tükendi</span>}
      </p>
      <p className="product-card__description">{description}</p>
      {isWebhookConfigured &&
        (inStock ? <OrderForm product={product} /> : <StockNotificationForm product={product} />)}
    </article>
  )
}
