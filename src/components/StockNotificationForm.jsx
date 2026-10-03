import { useId, useState } from 'react'
import { sendWebhook } from '../data/sendWebhook.js'
import { buildStockNotificationPayload } from '../data/webhookPayloads.js'

const EMPTY_FORM = { name: '', email: '' }

// Tükenen ürünlerin kartında: "Stok Bildirimi İste" butonu, tıklanınca ad + e-posta formu açılır.
export default function StockNotificationForm({ product }) {
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
      await sendWebhook(buildStockNotificationPayload(product, form))
      setForm(EMPTY_FORM)
      setStatus('success')
    } catch (error) {
      console.error('Stok bildirimi gönderilemedi:', error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="stock-notification-form__message" role="status">
        Teşekkürler. {product.name} yeniden hazır olduğunda size e-posta göndereceğiz.
      </p>
    )
  }

  if (!isOpen) {
    return (
      <button type="button" className="stock-notification-form__toggle" onClick={() => setIsOpen(true)}>
        Stok Bildirimi İste
      </button>
    )
  }

  const isSending = status === 'sending'

  return (
    <form className="stock-notification-form" onSubmit={handleSubmit}>
      <div className="stock-notification-form__field">
        <label htmlFor={`${id}-name`}>Adınız</label>
        <input id={`${id}-name`} name="name" value={form.name} onChange={updateField} required autoComplete="name" />
      </div>
      <div className="stock-notification-form__field">
        <label htmlFor={`${id}-email`}>E-posta</label>
        <input id={`${id}-email`} name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" />
      </div>

      {status === 'error' && (
        <p className="stock-notification-form__message stock-notification-form__message--error" role="alert">
          Bir sorun oldu, lütfen tekrar deneyin.
        </p>
      )}

      <div className="stock-notification-form__actions">
        <button type="submit" className="stock-notification-form__submit" disabled={isSending}>
          {isSending ? 'Gönderiliyor…' : 'Haber Ver'}
        </button>
        <button type="button" className="stock-notification-form__cancel" onClick={() => setIsOpen(false)} disabled={isSending}>
          Vazgeç
        </button>
      </div>
    </form>
  )
}
