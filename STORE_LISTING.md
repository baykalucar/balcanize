# Chrome Web Store Listing - Kopyala Yapıştır

## Extension Name
Balcanize - WhatsApp Emoji Reaction Customizer

## Short Description (132 karakter max)
Customize WhatsApp Web emoji reactions with your favorite emojis. Add unlimited emojis, drag to reorder. Simple and fast!

## Detailed Description (Store için)

� **Balcanize - WhatsApp Emoji Reaction Customizer** - Mesaj tepkilerinizi kişiselleştirin!

WhatsApp Web'in varsayılan 6 tepki emojisinden sıkıldınız mı? Bu extension ile kendi favori emojilerinizi seçin!

### ✨ Özellikler

✅ **Sınırsız Emoji** - İstediğiniz kadar emoji ekleyin
✅ **Sürükle-Bırak** - Emojileri kolayca sıralayın
✅ **Cihazlar Arası Senkronizasyon** - Chrome hesabınızla her yerde aynı ayarlar
✅ **Modern Arayüz** - WhatsApp'ın yeşil temasına uyumlu tasarım
✅ **Gizlilik Dostu** - Hiçbir veri toplamıyoruz

### 🚀 Nasıl Kullanılır?

1. Extension ikonuna tıklayın
2. Emoji grid'den favorilerinizi seçin
3. Sürükleyerek sıralayın
4. "Kaydet" butonuna tıklayın
5. WhatsApp Web'de tepki verirken yeni emojilerinizi görün!

### 🔒 Gizlilik

- Mesajlarınızı OKUMUYORUZ
- Kişisel veri TOPLAMIYORUZ
- Sadece seçtiğiniz emojiler yerel olarak saklanır

### 💡 İpuçları

- En sık kullandığınız emojileri başa koyun
- Ctrl+S ile hızlıca kaydedin
- "Sıfırla" butonu ile varsayılana dönün

---

❤️ Beğendiyseniz 5 yıldız verin!

📧 Sorun mu var? Yorum bırakın, yardımcı olalım.

---

*Bu extension WhatsApp LLC veya Meta Platforms ile bağlantılı değildir.*

## Category
Social & Communication

## Language
Turkish (Türkçe)

## Tags/Keywords
- whatsapp
- emoji
- reaction
- customizer
- web whatsapp
- emojis
- tepki

## Screenshot Descriptions

**Screenshot 1:** Extension popup - emoji seçici arayüzü
**Screenshot 2:** WhatsApp Web'de özelleştirilmiş tepki menüsü
**Screenshot 3:** Sürükle-bırak ile emoji sıralama

## Privacy Policy URL
GitHub Pages veya başka bir hosting'e PRIVACY_POLICY.md'yi yükleyip URL'sini kullanın.
Örnek: https://yourusername.github.io/whatsapp-emoji-customizer/privacy-policy

---

# 🔐 Privacy Practices Tab - Kopyala Yapıştır

Chrome Web Store Developer Console > Privacy practices sekmesinde kullanılacak metinler:

## Single Purpose Description
```
This extension allows users to customize the emoji reactions shown in WhatsApp Web's reaction menu by replacing the default emojis with user-selected favorites.
```

## Permission Justifications

### activeTab Justification
```
The activeTab permission is required to inject the content script into WhatsApp Web (web.whatsapp.com) when the user visits the site. This allows the extension to detect and modify the reaction emoji menu only on the active WhatsApp Web tab. The extension does not access any other tabs or websites.
```

### Host Permission Justification (web.whatsapp.com)
```
Host permission for web.whatsapp.com is required because the extension needs to run a content script on WhatsApp Web to detect when the emoji reaction menu appears and replace the default emojis with the user's custom selections. This permission is limited only to WhatsApp Web and no other websites.
```

### Storage Permission Justification
```
The storage permission (chrome.storage.sync) is used to save the user's custom emoji selections so they persist across browser sessions and sync across the user's Chrome devices. No personal data, messages, or browsing history is stored - only the user's emoji preferences (array of emoji characters).
```

### Remote Code Justification
```
This extension does NOT use any remote code. All JavaScript code is bundled within the extension package. The extension does not load, fetch, or execute any external scripts, code, or resources from remote servers.
```

## Data Usage Compliance Checklist

Aşağıdaki soruları Chrome Web Store'da işaretlemeniz gerekiyor:

### "Does your extension collect or use data?"
**Seçilecek:** "No, this extension does not collect or use any data"

### Eğer "Yes" seçmeniz gerekiyorsa:
- ❌ Personally identifiable information - **NO**
- ❌ Health information - **NO**
- ❌ Financial and payment information - **NO**
- ❌ Authentication information - **NO**
- ❌ Personal communications - **NO**
- ❌ Location - **NO**
- ❌ Web history - **NO**
- ❌ User activity - **NO**
- ❌ Website content - **NO**

### Data usage certifications (tümünü işaretleyin):
- ✅ "I certify that my item's data usage complies with the Chrome Web Store Developer Program Policies"
- ✅ "My item does not sell user data to third parties"
- ✅ "My item does not use or transfer user data for purposes unrelated to the item's functionality"
- ✅ "My item does not use or transfer user data to determine creditworthiness or for lending purposes"

---

# 📧 Account Tab Gereklilikleri

1. **Contact Email:** Geçerli bir e-posta adresi girin
2. **Email Verification:** Google'dan gelen doğrulama e-postasındaki linke tıklayın

---

# ✅ Yayınlama Kontrol Listesi

- [ ] Privacy Policy URL'si girildi
- [ ] Single purpose description girildi
- [ ] activeTab justification girildi
- [ ] Host permission justification girildi
- [ ] Storage justification girildi
- [ ] Remote code justification girildi ("No remote code" seçili olmalı)
- [ ] Data usage compliance onaylandı
- [ ] Contact email girildi ve doğrulandı
- [ ] En az 1 screenshot yüklendi (1280x800)
- [ ] Extension açıklaması girildi
- [ ] Category seçildi (Social & Communication)
