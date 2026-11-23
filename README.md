# Berat Yasa

[English portfolio](https://beratyasa.com/) · [Türkçe portfolyo](https://beratyasa.com/tr/) · [English CV](https://beratyasa.com/assets/berat-yasa-cv-en.pdf) · [Türkçe özgeçmiş](https://beratyasa.com/assets/berat-yasa-cv-tr.pdf)

## Edit your website and CV

1. Open the [English text](content/en.json), [Turkish text](content/tr.json) or [profile details](content/profile.json). The profile contains your email address, social links and programming languages.
2. Select the pencil icon. Edit the wording between quotation marks, then choose **Commit changes** and save to `main`.
3. Open **Actions → Publish portfolio**. When both jobs are green, GitHub Pages has published both language editions and their PDF CVs. A failed build shows the error in Actions.

## Siteyi ve özgeçmişi güncelleme

Yukarıdaki bağlantıdan İngilizce veya Türkçe metni aç. Kalem simgesine tıkla, tırnak içindeki metni düzenle ve **Commit changes** ile `main` dalına kaydet. Yeşil onay işareti sitenin GitHub Pages’te yayımlandığını gösterir. İşlem durumunu **Actions → Publish portfolio** bölümünden izleyebilirsin. İletişim bilgileri ve programlama dilleri iki dilde de aynı profil dosyasından alınır.

## Design files and local builds

Styles, icons and the portfolio portrait are in [`site/assets`](site/assets). The SVG artwork is editable. Replace `site/assets/berat-yasa.webp` to update the photograph on the website and both CVs.

With Node.js 24 and Google Chrome installed, run `npm ci` and `npm run build`. To preview the generated site, run `python3 -m http.server 8000 --directory site` and open `http://localhost:8000`. The optional `CHROME_BIN` environment variable selects a particular Chrome installation.

Fatih manages the domain registration, DNS and email forwarding at Cloudflare.
