import { useId, useState } from 'react'
import ConsentCheckbox from './ConsentCheckbox.jsx'
import { fetchOrderToken, sendWebhook } from '../data/sendWebhook.js'
import { EMAIL_HINT, EMAIL_PATTERN, MAX_LENGTH, MAX_QUANTITY, PHONE_HINT, PHONE_PATTERN } from '../data/formRules.js'
import { buildOrderPayload } from '../data/webhookPayloads.js'

const EMPTY_FORM = { name: '', phone: '', email: '', quantity: 1, consent: false }

// Stoktaki ürünlerin kartında: "Sipariş Ver" butonu, tıklanınca sipariş formu açılır.
export default function OrderForm({ product }) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const updateField = (event) => {
    const { name, type, value, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return // çift gönderim koruması (buton da devre dışı)
    setStatus('sending')
    try {
      const token = await fetchOrderToken()
      await sendWebhook(buildOrderPayload(product, form), token)
      setForm(EMPTY_FORM)
      setStatus('success')
    } catch (error) {
      console.error('Sipariş gönderilemedi:', error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="order-form__message" role="status">
        Teşekkürler, siparişiniz bize ulaştı. Teyit için sizi telefonla arayacağız.
      </p>
    )
  }

  if (!isOpen) {
    return (
      <button type="button" className="order-form__toggle" onClick={() => setIsOpen(true)}>
        Sipariş Ver
      </button>
    )
  }

  const isSending = status === 'sending'

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <div className="order-form__field">
        <label htmlFor={`${id}-name`}>Adınız</label>
        <input id={`${id}-name`} name="name" maxLength={MAX_LENGTH.name} value={form.name} onChange={updateField} required autoComplete="name" />
      </div>
      <div className="order-form__field">
        <label htmlFor={`${id}-phone`}>Telefon</label>
        <input id={`${id}-phone`} name="phone" type="tel" pattern={PHONE_PATTERN} title={PHONE_HINT} maxLength={MAX_LENGTH.phone} value={form.phone} onChange={updateField} required autoComplete="tel" />
      </div>
      <div className="order-form__field">
        <label htmlFor={`${id}-email`}>E-posta (isteğe bağlı)</label>
        <input id={`${id}-email`} name="email" type="email" pattern={EMAIL_PATTERN} title={EMAIL_HINT} maxLength={MAX_LENGTH.email} value={form.email} onChange={updateField} autoComplete="email" />
      </div>
      <div className="order-form__field">
        <label htmlFor={`${id}-quantity`}>Adet</label>
        <input id={`${id}-quantity`} name="quantity" type="number" min="1" max={MAX_QUANTITY} value={form.quantity} onChange={updateField} required />
      </div>
      <ConsentCheckbox
        id={`${id}-consent`}
        checked={form.consent}
        onChange={updateField}
      >
        Siparişim için verdiğim ad, telefon ve e-posta bilgilerimin yurt dışındaki hizmet sağlayıcılara aktarılmasına
        açık rıza veriyorum.
      </ConsentCheckbox>

      {status === 'error' && (
        <p className="order-form__message order-form__message--error" role="alert">
          Bir sorun oldu, lütfen tekrar deneyin.
        </p>
      )}

      <div className="order-form__actions">
        <button type="submit" className="order-form__submit" disabled={isSending}>
          {isSending ? 'Gönderiliyor…' : 'Siparişi Gönder'}
        </button>
        <button type="button" className="order-form__cancel" onClick={() => setIsOpen(false)} disabled={isSending}>
          Vazgeç
        </button>
      </div>
    </form>
  )
}
