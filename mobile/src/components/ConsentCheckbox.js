// KVKK açık rıza kutusu (web'deki ConsentCheckbox'ın karşılığı). Satırın tamamına dokunmak kutuyu
// işaretler (web'deki <label> gibi); Aydınlatma Metni bağlantısı sitede açılır.
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { SITE_URL } from '../shared'
import { colors } from '../theme'

export default function ConsentCheckbox({ checked, onChange, children }) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="KVKK açık rıza"
      style={styles.row}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>{checked && <Text style={styles.tick}>✓</Text>}</View>
      <Text style={styles.text}>
        {children}{' '}
        <Text style={styles.link} onPress={() => Linking.openURL(`${SITE_URL}#gizlilik`)} accessibilityRole="link">
          Aydınlatma Metni
        </Text>
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'flex-start' },
  box: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: colors.darkBrown,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  boxChecked: { backgroundColor: colors.darkBrown },
  tick: { color: colors.card, fontSize: 14, fontWeight: 'bold' },
  text: { flex: 1, fontSize: 13, lineHeight: 18, color: colors.muted },
  link: { color: colors.accent, textDecorationLine: 'underline' },
})
