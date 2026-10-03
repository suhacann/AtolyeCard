import { QRCodeSVG } from 'qrcode.react'
import { SITE_URL } from '../data/site.js'

export default function SiteQrCode() {
  return (
    <figure className="site-qr-code">
      <QRCodeSVG
        value={SITE_URL}
        size={112}
        fgColor="#3b2a1e"
        bgColor="#f6f0e6"
        title="Ahşap Atölyesi sitesinin QR kodu"
      />
      <figcaption>Telefonda açmak için okutun</figcaption>
    </figure>
  )
}
