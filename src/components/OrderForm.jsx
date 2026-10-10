import { useId, useState } from 'react'
import { fetchOrderToken, sendWebhook } from '../data/sendWebhook.js'
import { EMAIL_HINT, EMAIL_PATTERN } from '../data/formRules.js'
import { buildOrderPayload } from '../data/webhookPayloads.js'

const EMPTY_FORM = { name: '', phone: '', email: '', quantity: 1 }

// Stoktaki ürünlerin kartında: "Sipariş Ver" butonu, tıklanınca sipariş formu açılır.
export default function OrderForm({ product }) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
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
        <input id={`${id}-name`} name="name" value={form.name} onChange={updateField} required autoComplete="name" />
      </div>
      <div className="order-form__field">
        <label htmlFor={`${id}-phone`}>Telefon</label>
        <input id={`${id}-phone`} name="phone" type="tel" value={form.phone} onChange={updateField} required autoComplete="tel" />
      </div>
      <div className="order-form__field">
        <label htmlFor={`${id}-email`}>E-posta (isteğe bağlı)</label>
        <input id={`${id}-email`} name="email" type="email" pattern={EMAIL_PATTERN} title={EMAIL_HINT} value={form.email} onChange={updateField} autoComplete="email" />
      </div>
      <div className="order-form__field">
        <label htmlFor={`${id}-quantity`}>Adet</label>
        <input id={`${id}-quantity`} name="quantity" type="number" min="1" value={form.quantity} onChange={updateField} required />
      </div>

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
