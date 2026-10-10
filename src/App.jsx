import { useEffect, useState } from 'react'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import ProductList from './components/ProductList.jsx'
import SiteQrCode from './components/SiteQrCode.jsx'

const PRIVACY_HASH = '#gizlilik'

export default function App() {
  const [hash, setHash] = useState(window.location.hash)

  useEffect(() => {
    const updateHash = () => {
      setHash(window.location.hash)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', updateHash)
    return () => window.removeEventListener('hashchange', updateHash)
  }, [])

  const isPrivacyPage = hash === PRIVACY_HASH

  return (
    <>
      <header className="site-header">
        <h1>Ahşap Atölyesi</h1>
        <p>Elde oyulmuş kuksa ve tahta kaşıklar</p>
      </header>

      <main className="site-main">
        {isPrivacyPage ? (
          <PrivacyPolicy />
        ) : (
          <>
            <h2>Ürünlerimiz</h2>
            <ProductList />
          </>
        )}
      </main>

      <footer className="site-footer">
        <SiteQrCode />
        <p>© 2026 Ahşap Atölyesi · Her ürün elde, tek tek üretilir.</p>
        <p>
          <a href={PRIVACY_HASH}>Gizlilik ve KVKK Aydınlatma Metni</a>
        </p>
      </footer>
    </>
  )
}
