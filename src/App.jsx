import ProductList from './components/ProductList.jsx'
import SiteQrCode from './components/SiteQrCode.jsx'

export default function App() {
  return (
    <>
      <header className="site-header">
        <h1>Ahşap Atölyesi</h1>
        <p>Elde oyulmuş kuksa ve tahta kaşıklar</p>
      </header>

      <main className="site-main">
        <h2>Ürünlerimiz</h2>
        <ProductList />
      </main>

      <footer className="site-footer">
        <SiteQrCode />
        <p>© 2026 Ahşap Atölyesi · Her ürün elde, tek tek üretilir.</p>
      </footer>
    </>
  )
}
