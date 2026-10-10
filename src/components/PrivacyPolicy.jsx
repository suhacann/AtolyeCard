// KVKK aydınlatma metni ve gizlilik politikası (#gizlilik). Köşeli parantezli yerler atölye sahibince doldurulacak.
export default function PrivacyPolicy() {
  return (
    <article className="privacy-policy">
      <p>
        <a href="#">← Ürünlere dön</a>
      </p>
      <h2>Gizlilik ve Kişisel Verilerin Korunması Aydınlatma Metni</h2>
      <p className="privacy-policy__updated">Son güncelleme: Ekim 2026</p>

      <p>
        Ahşap Atölyesi olarak sipariş ve stok bildirimi formlarında bize verdiğiniz bilgileri yalnızca bu işler için
        kullanıyoruz. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında sizi bilgilendirmek
        için hazırlandı.
      </p>

      <h3>Veri sorumlusu</h3>
      <p>
        [Atölye sahibinin adı soyadı], [adres]. İletişim: [e-posta adresi]
      </p>

      <h3>Hangi bilgileri topluyoruz</h3>
      <ul>
        <li>
          <strong>Sipariş formu:</strong> adınız, telefon numaranız, isteğe bağlı olarak e-posta adresiniz, seçtiğiniz
          ürün ve adet. Teslimat adresinizi formda değil, siparişi teyit ettiğimiz telefon görüşmesinde alırız.
        </li>
        <li>
          <strong>Stok bildirimi formu:</strong> adınız, e-posta adresiniz ve haber almak istediğiniz ürün.
        </li>
        <li>
          <strong>IP adresi:</strong> aynı adresten çok sayıda istek gelmesini önlemek için kısa süreliğine (birkaç
          dakika) sunucu belleğinde tutulur; biz kalıcı olarak kaydetmeyiz. Barındırma hizmeti Vercel kendi güvenlik
          ve işletim kayıtlarında IP adresini tutabilir.
        </li>
      </ul>
      <p>Sitede çerez, reklam ya da ziyaretçi takip aracı kullanılmıyor.</p>

      <h3>Ne için kullanıyoruz</h3>
      <ul>
        <li>Siparişinizi telefonla teyit etmek, hazırlamak ve size ulaştırmak</li>
        <li>Tükenen ürün yeniden hazır olduğunda size bir kez e-posta göndermek</li>
      </ul>
      <p>Bilgilerinizi pazarlama amacıyla kullanmıyor, satmıyor ya da kiralamıyoruz.</p>

      <h3>Hukuki sebep</h3>
      <p>
        Sipariş bilgileri, sizinle yapılacak satış sözleşmesinin kurulması ve yerine getirilmesi için işlenir (KVKK
        m. 5/2-c); bunun için ayrıca rızanız gerekmez. Stok bildirimi için bilgilerinizin işlenmesi ve her iki
        formdaki bilgilerin yurt dışındaki hizmet sağlayıcılara aktarılması formdaki açık rızanıza dayanır (KVKK
        m. 5/1 ve m. 9).
      </p>

      <h3>Kimlerle paylaşıyoruz</h3>
      <ul>
        <li>
          <strong>Vercel Inc. (ABD):</strong> sitenin barındırıldığı hizmet. Form istekleri bu sunuculardan geçer.
        </li>
        <li>
          <strong>[Form bildirim hizmeti] ([ülke]):</strong> form bilgileri bize bu hizmet üzerinden ulaşır.
        </li>
      </ul>
      <p>Bunların dışında, yasal bir zorunluluk olmadıkça bilgilerinizi kimseyle paylaşmıyoruz.</p>

      <h3>Ne kadar saklıyoruz</h3>
      <ul>
        <li>Sipariş bilgileri: vergi ve ticaret mevzuatının öngördüğü süre boyunca, [süre]</li>
        <li>Stok bildirimi talepleri: bildirim e-postası gönderildikten sonra silinir</li>
      </ul>

      <h3>Haklarınız</h3>
      <p>KVKK'nın 11. maddesi uyarınca bize başvurarak şunları isteyebilirsiniz:</p>
      <ul>
        <li>Hakkınızda bilgi işlenip işlenmediğini ve hangi bilgilerin işlendiğini öğrenmek</li>
        <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenmek</li>
        <li>Bilgilerin aktarıldığı kişileri öğrenmek</li>
        <li>Eksik ya da yanlış bilgilerin düzeltilmesini, silinmesini ya da yok edilmesini istemek</li>
        <li>Düzeltme ve silme işlemlerinin bilgilerin aktarıldığı kişilere bildirilmesini istemek</li>
        <li>Otomatik sistemlerle yapılan analizin aleyhinize bir sonuç doğurmasına itiraz etmek</li>
        <li>Kanuna aykırı işleme nedeniyle zarara uğradıysanız zararın giderilmesini talep etmek</li>
      </ul>
      <p>
        Açık rızanızı dilediğiniz zaman geri alabilirsiniz. Başvurularınızı [e-posta adresi] adresine
        yazabilirsiniz; en geç 30 gün içinde yanıtlıyoruz.
      </p>
    </article>
  )
}
