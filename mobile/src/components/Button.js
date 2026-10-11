// Sitedeki koyu kahve, yuvarlak buton.
import { Pressable, Text } from 'react-native'
import { formStyles } from '../styles'

export default function Button({ title, onPress, disabled, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [formStyles.button, pressed && formStyles.buttonPressed, disabled && formStyles.buttonDisabled, style]}
    >
      <Text style={formStyles.buttonText}>{title}</Text>
    </Pressable>
  )
}
