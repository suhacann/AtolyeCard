// Etiketli tek satırlık giriş alanı (web'deki <label> + <input> ikilisi).
import { Text, TextInput, View } from 'react-native'
import { formStyles } from '../styles'
import { colors } from '../theme'

export default function FormField({ label, ...inputProps }) {
  return (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>
      <TextInput style={formStyles.input} accessibilityLabel={label} placeholderTextColor={colors.muted} {...inputProps} />
    </View>
  )
}
