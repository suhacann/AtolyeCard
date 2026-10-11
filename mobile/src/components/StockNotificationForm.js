// Tükenen ürünlerin kartında "Stok Bildirimi İste": açılınca ad, e-posta ve rıza.
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { sendWebhook } from '../api'
import { buildStockNotificationPayload, MAX_LENGTH } from '../shared'
import { formStyles } from '../styles'
import { validateForm } from '../validation'
import Button from './Button'
import ConsentCheckbox from './ConsentCheckbox'
import FormField from './FormField'

const EMPTY_FORM = { name: '', email: '', consent: false }

export default function StockNotificationForm({ product }) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [validationError, setValidationError] = useState(null)

  const update = (name) => (value) => setForm((current) => ({ ...current, [name]: value }))

  const handleSubmit = async () => {
    if (status === 'sending') return // çift gönderim koruması (buton da devre dışı)
    const problem = validateForm(form, { requireEmail: true })
    setValidationError(problem)
    if (problem) return

    setStatus('sending')
    try {
      await sendWebhook(buildStockNotificationPayload(product, form))
      setForm(EMPTY_FORM)
      setStatus('success')
    } catch (error) {
      console.error('Stok bildirimi gönderilemedi:', error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <Text style={formStyles.message}>Teşekkürler. {product.name} yeniden hazır olduğunda size e-posta göndereceğiz.</Text>
  }

  if (!isOpen) {
    return <Button title="Stok Bildirimi İste" onPress={() => setIsOpen(true)} style={formStyles.toggle} />
  }

  const isSending = status === 'sending'

  return (
    <View style={formStyles.form}>
      <FormField label="Adınız" value={form.name} onChangeText={update('name')} maxLength={MAX_LENGTH.name} autoComplete="name" textContentType="name" />
      <FormField label="E-posta" value={form.email} onChangeText={update('email')} maxLength={MAX_LENGTH.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />

      <ConsentCheckbox checked={form.consent} onChange={update('consent')}>
        Ad ve e-posta bilgilerimin, ürün yeniden hazır olduğunda bana e-posta gönderilmesi amacıyla işlenmesine ve yurt dışındaki hizmet sağlayıcılara aktarılmasına açık rıza veriyorum.
      </ConsentCheckbox>

      {validationError && <Text style={formStyles.error}>{validationError}</Text>}
      {status === 'error' && <Text style={formStyles.error}>Bir sorun oldu, lütfen tekrar deneyin.</Text>}

      <View style={formStyles.actions}>
        <Button title={isSending ? 'Gönderiliyor…' : 'Haber Ver'} onPress={handleSubmit} disabled={isSending} />
        <Pressable onPress={() => setIsOpen(false)} disabled={isSending} accessibilityRole="button">
          <Text style={formStyles.cancelText}>Vazgeç</Text>
        </Pressable>
      </View>
    </View>
  )
}
