// KVKK açık rıza kutusu. İşaretlenmeden form gönderilemez (required).
// children: rızanın kapsamı (hangi veri, hangi amaçla, neye rıza veriliyor); sonuna Aydınlatma Metni bağlantısı eklenir.
export default function ConsentCheckbox({ id, checked, onChange, children }) {
  return (
    <div className="consent-checkbox">
      <input id={id} name="consent" type="checkbox" checked={checked} onChange={onChange} required />
      <label htmlFor={id}>
        {children}{' '}
        <a href={`${import.meta.env.BASE_URL}#gizlilik`} target="_blank" rel="noopener noreferrer">
          Aydınlatma Metni
        </a>
      </label>
    </div>
  )
}
