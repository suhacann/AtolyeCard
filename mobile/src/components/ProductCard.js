// Tek ürün kartı: emoji görseli, ad, fiyat (+ "Tükendi"), açıklama ve uygun form.
import { StyleSheet, Text, View } from 'react-native'
import { formatPrice } from '../shared'
import { colors } from '../theme'
import OrderForm from './OrderForm'
import StockNotificationForm from './StockNotificationForm'

export default function ProductCard({ product }) {
  const { name, price, description, emoji, inStock } = product

  return (
    <View style={[styles.card, !inStock && styles.soldOut]}>
      <View style={styles.image}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatPrice(price)}</Text>
        {!inStock && <Text style={styles.badge}>Tükendi</Text>}
      </View>
      <Text style={styles.description}>{description}</Text>
      {inStock ? <OrderForm product={product} /> : <StockNotificationForm product={product} />}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 20, marginBottom: 20 },
  soldOut: { borderStyle: 'dashed' },
  image: { height: 120, borderRadius: 8, backgroundColor: colors.page, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emoji: { fontSize: 56 },
  name: { fontSize: 19, fontWeight: '600', color: colors.darkBrown, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  price: { fontSize: 17, fontWeight: 'bold', color: colors.accent },
  badge: { fontSize: 12, color: colors.card, backgroundColor: colors.muted, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, overflow: 'hidden' },
  description: { fontSize: 15, lineHeight: 22, color: colors.text },
})
