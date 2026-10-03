// Gerçek ürün fotoğrafları gelene kadar emoji gösteriliyor.
export default function ProductImage({ emoji, alt }) {
  return (
    <div className="product-image" role="img" aria-label={alt}>
      {emoji}
    </div>
  )
}
