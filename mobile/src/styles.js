// Formların ortak stilleri (sipariş ve stok bildirimi aynı görünür).
import { StyleSheet } from 'react-native'
import { colors } from './theme'

export const formStyles = StyleSheet.create({
  form: { marginTop: 16 },
  field: { marginBottom: 12 },
  label: { fontSize: 14, color: colors.text, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.page,
    color: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  button: { backgroundColor: colors.darkBrown, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18, alignSelf: 'flex-start' },
  buttonPressed: { backgroundColor: colors.accent },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.card, fontSize: 15, fontWeight: '600' },
  toggle: { marginTop: 16 },
  cancelText: { color: colors.muted, fontSize: 15, padding: 8 },
  message: { marginTop: 16, color: colors.text, fontSize: 14, lineHeight: 20 },
  error: { color: colors.accent, fontWeight: 'bold', marginBottom: 8, fontSize: 14 },
})
