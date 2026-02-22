# Balcanize - WhatsApp Emoji Reaction Customizer 🍆

WhatsApp Web üzerindeki mesaj tepki (reaction) emojilerini özelleştirmenizi sağlayan bir Chrome extension.

## Özellikler

- ✅ Varsayılan 6 emoji yerine istediğiniz kadar emoji ekleyin
- ✅ Sürükle-bırak ile emojilerin sırasını değiştirin
- ✅ Emojileriniz cihazlar arası senkronize edilir (Chrome hesabınızla)
- ✅ WhatsApp'ın yeşil temasına uyumlu modern arayüz

## Kurulum (Geliştirici Modu)

1. Chrome'da `chrome://extensions` sayfasını açın
2. Sağ üst köşeden **"Geliştirici modu"** (Developer mode) seçeneğini aktifleştirin
3. **"Paketlenmemiş öğe yükle"** (Load unpacked) butonuna tıklayın
4. Bu klasörü (`whatsapp-emoji-customizer`) seçin
5. Extension yüklenecek ve araç çubuğunda görünecek

## Kullanım

1. WhatsApp Web'i açın: https://web.whatsapp.com
2. Extension ikonuna tıklayarak emoji seçici popup'ını açın
3. Emoji grid'den istediğiniz emojileri ekleyin veya çıkarın
4. Sürükleyerek emojilerin sırasını değiştirin
5. **"Kaydet"** butonuna tıklayın
6. WhatsApp Web'de bir mesajın üzerine gelin ve tepki menüsünü açın
7. Seçtiğiniz emojiler görünecek!

## Dosya Yapısı

```
whatsapp-emoji-customizer/
├── manifest.json      # Extension konfigürasyonu (Manifest V3)
├── content.js         # WhatsApp Web'e enjekte edilen script
├── popup.html         # Popup arayüzü
├── popup.js           # Popup mantığı
├── popup.css          # Popup stilleri
├── styles.css         # WhatsApp Web'e enjekte edilen stiller
├── icons/
│   ├── icon16.png     # 16x16 ikon
│   ├── icon48.png     # 48x48 ikon
│   └── icon128.png    # 128x128 ikon
└── README.md          # Bu dosya
```

## Teknik Detaylar

### Manifest V3
Bu extension, Chrome'un en güncel Manifest V3 formatını kullanır:
- `chrome.storage.sync` ile veri senkronizasyonu
- Content script ile DOM manipülasyonu
- `MutationObserver` ile dinamik element takibi

### WhatsApp Web DOM Yapısı
WhatsApp Web, obfuscated (karmaşık) CSS class adları kullanır. Bu nedenle extension:
- `data-emoji` attribute'u
- `aria-label` attribute'u  
- DOM yapısı ve element hiyerarşisi
kullanarak tepki menüsünü tespit eder.

⚠️ **NOT:** WhatsApp Web güncellemeleri bu extension'ı etkileyebilir. Sorun yaşarsanız lütfen issue açın.

## Chrome Web Store Yayınlama

Chrome Web Store'a yayınlamak için:

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) hesabı oluşturun
2. Tek seferlik $5 geliştirici kaydı ücreti ödeyin
3. Extension klasörünü ZIP olarak sıkıştırın
4. Dashboard'dan yükleyin
5. Store listing bilgilerini doldurun:
   - Açıklama
   - Ekran görüntüleri
   - Gizlilik politikası URL'si

## Lisans

MIT License

## Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

---

Made with ❤️ for WhatsApp users
