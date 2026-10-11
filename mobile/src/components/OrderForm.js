// Stoktaki ürünlerin kartında "Sipariş Ver": açılınca ad, telefon, e-posta, adet ve rıza.
// Gönderim web'dekiyle aynı: önce JWT, sonra /api/webhook.
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { fetchOrderToken, sendWebhook } from '../api'
import { buildOrderPayload, MAX_LENGTH, MAX_QUANTITY } from '../shared'
import { formStyles } from '../styles'
import { validateForm } from '../validation'
import Button from './Button'
import ConsentCheckbox from './ConsentCheckbox'
import FormField from './FormField'

const EMPTY_FORM = { name: '', phone: '', email: '', quantity: '1', consent: false }

export default function OrderForm({ product }) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [validationError, setValidationError] = useState(null)

  const update = (name) => (value) => setForm((current) => ({ ...current, [name]: value }))

  const handleSubmit = async () => {
    if (status === 'sending') return // çift gönderim koruması (buton da devre dışı)
    const problem = validateForm(form, { requirePhone: true, hasQuantity: true })
    setValidationError(problem)
    if (problem) return

    setStatus('sending')
    try {
      const token = await fetchOrderToken()
      await sendWebhook(buildOrderPayload(product, { ...form, quantity: Number(form.quantity) }), token)
      setForm(EMPTY_FORM)
      setStatus('success')
    } catch (error) {
      console.error('Sipariş gönderilemedi:', error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <Text style={formStyles.message}>Teşekkürler, siparişiniz bize ulaştı. Teyit için sizi telefonla arayacağız.</Text>
  }

  if (!isOpen) {
    return <Button title="Sipariş Ver" onPress={() => setIsOpen(true)} style={formStyles.toggle} />
  }

  const isSending = status === 'sending'

  return (
    <View style={formStyles.form}>
      <FormField label="Adınız" value={form.name} onChangeText={update('name')} maxLength={MAX_LENGTH.name} autoComplete="name" textContentType="name" />
      <FormField label="Telefon" value={form.phone} onChangeText={update('phone')} maxLength={MAX_LENGTH.phone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" placeholder="0555 123 45 67" />
      <FormField label="E-posta (isteğe bağlı)" value={form.email} onChangeText={update('email')} maxLength={MAX_LENGTH.email} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
      <FormField label="Adet" value={form.quantity} onChangeText={update('quantity')} keyboardType="number-pad" maxLength={String(MAX_QUANTITY).length} />

      <ConsentCheckbox checked={form.consent} onChange={update('consent')}>
        Siparişim için verdiğim ad, telefon ve e-posta bilgilerimin yurt dışındaki hizmet sağlayıcılara aktarılmasına açık rıza veriyorum.
      </ConsentCheckbox>

      {validationError && <Text style={formStyles.error}>{validationError}</Text>}
      {status === 'error' && <Text style={formStyles.error}>Bir sorun oldu, lütfen tekrar deneyin.</Text>}

      <View style={formStyles.actions}>
        <Button title={isSending ? 'Gönderiliyor…' : 'Siparişi Gönder'} onPress={handleSubmit} disabled={isSending} />
        <Pressable onPress={() => setIsOpen(false)} disabled={isSending} accessibilityRole="button">
          <Text style={formStyles.cancelText}>Vazgeç</Text>
        </Pressable>
      </View>
    </View>
  )
}
