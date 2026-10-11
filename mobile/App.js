// AtölyeKart mobil: web sitesindeki katalog, kategori filtresi ve iki form.
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import CategoryFilter from './src/components/CategoryFilter'
import ProductCard from './src/components/ProductCard'
import { ALL_CATEGORIES, products, SITE_URL, validateProducts } from './src/shared'
import { colors } from './src/theme'

if (__DEV__) {
  for (const problem of validateProducts(products)) {
    console.warn(`[products.js] ${problem}`)
  }
}

export default function App() {
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const visibleProducts = category === ALL_CATEGORIES ? products : products.filter((product) => product.category === category)

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={styles.title}>Ahşap Atölyesi</Text>
              <Text style={styles.subtitle}>Elde oyulmuş kuksa ve tahta kaşıklar</Text>
            </View>

            <View style={styles.main}>
              <Text style={styles.heading}>Ürünlerimiz</Text>
              <CategoryFilter selected={category} onSelect={setCategory} />
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2026 Ahşap Atölyesi · Her ürün elde, tek tek üretilir.</Text>
              <Text style={styles.footerLink} onPress={() => Linking.openURL(`${SITE_URL}#gizlilik`)}>
                Gizlilik ve KVKK Aydınlatma Metni
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.darkBrown },
  content: { backgroundColor: colors.page, flexGrow: 1 },
  header: { backgroundColor: colors.darkBrown, paddingVertical: 28, paddingHorizontal: 16, alignItems: 'center' },
  title: { color: colors.card, fontSize: 26, fontWeight: 'bold' },
  subtitle: { color: colors.border, fontSize: 15, marginTop: 6 },
  main: { padding: 16, paddingTop: 28 },
  heading: { fontSize: 22, fontWeight: '600', color: colors.darkBrown, textAlign: 'center', marginBottom: 16 },
  footer: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16, gap: 8 },
  footerText: { color: colors.muted, fontSize: 13, textAlign: 'center' },
  footerLink: { color: colors.accent, fontSize: 13, textDecorationLine: 'underline' },
})
