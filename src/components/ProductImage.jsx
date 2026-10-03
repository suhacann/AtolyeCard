// Gerçek ürün fotoğrafları gelene kadar emoji gösteriliyor.
export default function ProductImage({ product }) {
  const { emoji, name } = product

  return (
    <div className="product-image" role="img" aria-label={name}>
      {emoji}
    </div>
  )
}
