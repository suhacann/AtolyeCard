// Ürün listesinin üstünde kategori düğmeleri: Tümü / Kuksalar / Kaşıklar.
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ALL_CATEGORIES, ALL_CATEGORIES_LABEL, CATEGORIES, CATEGORY_LABELS } from '../shared'
import { colors } from '../theme'

export default function CategoryFilter({ selected, onSelect }) {
  const options = [{ value: ALL_CATEGORIES, label: ALL_CATEGORIES_LABEL }, ...CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] }))]

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {options.map((option) => {
        const isActive = selected === option.value
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            style={[styles.option, isActive && styles.optionActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 20 },
  option: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 7 },
  optionActive: { backgroundColor: colors.darkBrown, borderColor: colors.darkBrown },
  label: { color: colors.text, fontSize: 15 },
  labelActive: { color: colors.card },
})
