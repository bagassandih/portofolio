# Portfolio — Bagas Arisandi Hidayat

<div align="center">

**Backend Developer** · Node.js · Go · PHP (Laravel/Lumen) · Building scalable, high-performance systems

🌐 **Live:** [bagassandih.my.id](https://bagassandih.my.id) · [bagassandih.github.io/portofolio](https://bagassandih.github.io/portofolio/)

</div>

---

## Overview

Personal portfolio website yang menampilkan pengalaman kerja, pendidikan, keahlian, dan proyek sebagai seorang **Backend Developer**. Situs ini adalah _single-page_ statis yang ringan — tanpa framework dan tanpa build tooling — dibangun murni dengan **HTML**, **CSS**, dan **vanilla JavaScript**.

Seluruh konten dirender di sisi klien dari satu sumber data JSON (`data/data.json`), sehingga isi situs dan kode dipisahkan secara rapi. Untuk mengubah konten, cukup edit file JSON-nya. `index.html` sengaja hanya berisi kerangka ber-`id` — tidak ada teks atau path statis di dalamnya.

Ada satu pengecualian kecil: **foto hero** memakai dua berkas — foto asli dan versi halftone-nya — dan yang kedua harus dibangkitkan dari yang pertama. Lihat [Mengganti foto hero](#mengganti-foto-hero).

## Features

- 🚀 **Sepenuhnya statis** — cepat, tidak ada server-side rendering, mudah di-hosting di mana saja.
- 📦 **Data-driven** — seluruh konten (bio, pengalaman, skill, proyek, kontak) dimuat dari `data/data.json`.
- 📱 **Responsive** — layout menyesuaikan dari mobile hingga desktop, dengan menu hamburger.
- 📄 **Download resume** — tombol untuk mengunduh resume (PDF) langsung dari situs.
- ✉️ **Kontak email** — toast SweetAlert2 menampilkan alamat email saat kartu Gmail diklik.
- 🎨 **"Henry"** — 100% monokrom hangat: kanvas Paper `#fafafa` & panel Ink `#2a2722`, tanpa aksen kromatik, radius 12px saja, flat tanpa shadow, layout full-bleed editorial. Satu-satunya elemen berwarna di halaman adalah **foto hero saat diam** — itu keputusan sadar; begitu di-hover, platnya kembali sepenuhnya dua tinta.
- ✒️ **Tiga register tipografi** — Inter 400/700 (substitusi Neue Montreal) untuk UI/body, Fraunces (substitusi Louize Display/Louize) untuk headline serif editorial, dan Antonio (substitusi Manuka) untuk masthead ultra-condensed "Selected Works".
- 🖨️ **Gimik plat cetak** — saat plat hero di-hover, foto memudar dan berganti jadi halftone dua tinta (Ink di atas Paper) sambil meleset 3px, sehingga kertas menyembul di tepinya seperti cetakan yang salah register. Titik halftone-nya membesar-mengecil mengikuti terang-gelap foto, bukan pola seragam. Hanya aktif di perangkat berpenunjuk presisi; di layar sentuh tetap foto saja.
- 🎨 **Transisi halus** — hover effects yang tenang dan smooth-scroll navigation. Semua gerak tunduk pada `prefers-reduced-motion`.
- 🖼️ **Favicon lengkap** — SVG, PNG, ICO, dan `apple-touch-icon` dengan identitas brand.
- ♿ **Aksesibel & SEO-friendly** — meta description, `theme-color`, dan semantic HTML.

## Tech Stack

| Layer        | Teknologi |
| ------------ | --------- |
| Markup       | HTML5 |
| Styling      | CSS3 (CSS custom properties, flexbox, CSS Grid) |
| Logic        | Vanilla JavaScript (ES6+) |
| Data         | JSON (`data/data.json`) |
| Fonts        | [Inter](https://fonts.google.com/specimen/Inter) (Neue Montreal · UI) · [Fraunces](https://fonts.google.com/specimen/Fraunces) (Louize Display/Louize · serif) · [Antonio](https://fonts.google.com/specimen/Antonio) (Manuka · masthead) — Google Fonts |
| Libraries    | [SweetAlert2](https://sweetalert2.github.io/) |
| Tool (opsional) | Python 3 + Pillow + NumPy — hanya untuk `tools/make-halftone.py` |
| Hosting      | GitHub Pages (custom domain via `CNAME`) |

## Sections

1. **Home** — badge role, nama (display), deskripsi singkat, tombol _Download Resume_ & _Contact Me_.
2. **Work Experience** — riwayat pekerjaan beserta tech stack tiap posisi.
3. **Education** — pendidikan formal, bootcamp, dan kursus online.
4. **Skills** — dibagi menjadi _Hardskill_, _Other Skills_, dan _Softskill_.
5. **Project** — kartu proyek (klik untuk membuka repository/demo).
6. **Contact** — LinkedIn, YouTube, Instagram, Gmail, dan GitHub.

## Project Structure

```
portofolio/
├── index.html          # Kerangka halaman ber-id — tanpa teks/path statis
├── css/
│   └── style.css       # Seluruh styling & responsive design
├── js/
│   ├── loadData.js     # Fetch data.json & render tiap section
│   ├── interactions.js # Gimik: kursor ink, reveal, rail proyek, ticker
│   ├── utilities.js    # Helper: openLink, scroll, toast email
│   └── index.js        # Init + hamburger menu
├── data/
│   └── data.json       # Semua konten situs (single source of truth)
├── assets/
│   ├── docs/           # Resume (PDF)
│   └── images/
│       └── home/
│           ├── asset-1.jpeg           # Foto hero — keadaan diam
│           └── asset-1-halftone.png   # Halftone hero — keadaan hover (hasil tools/)
├── tools/
│   └── make-halftone.py # Pembuat berkas halftone dari foto hero
├── reference/          # Dokumen acuan desain "Henry" (bukan bagian situs)
├── favicon.svg         # Favicon vector (primary)
├── favicon.ico         # Favicon multi-size (legacy)
├── apple-touch-icon.png
├── android-chrome-*.png
├── site.webmanifest    # PWA manifest & theme color
└── CNAME               # Custom domain (bagassandih.my.id)
```

## Getting Started

Tidak ada dependency yang perlu di-install untuk menjalankan situs. Kamu hanya perlu menjalankan server statis agar `fetch` JSON bekerja (protokol `file://` umumnya diblokir oleh browser).

> Skrip `tools/make-halftone.py` memerlukan `pillow` dan `numpy`, tapi itu hanya dipakai saat kamu mengganti foto hero — bukan untuk menjalankan situs.

```bash
# Dari root repositori
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

Alternatif lain: gunakan extension **Live Server** di VS Code.

> **Catatan lokal vs produksi:** secara default `js/loadData.js` mengambil konten dari URL produksi (`raw.githubusercontent.com/.../data/data.json`). Untuk memakai `data/data.json` lokal saat development, buka `js/loadData.js` lalu:
>
> ```js
> const response = await fetch("./data/data.json"); // locals
> // const response = await fetch("https://raw.githubusercontent.com/..."); // pages
> ```

## Customization

1. **Konten** — edit `data/data.json`. Tambah/hapus pengalaman, project, skill, kontak, atau ubah bio di bagian `HOME.DESCRIPTION`.
2. **Gambar & resume** — letakkan file di `assets/images/` atau `assets/docs/`, lalu perbarui path di `data.json`. Khusus **foto hero**, ada langkah tambahan — lihat [Mengganti foto hero](#mengganti-foto-hero) di bawah.
3. **Tampilan** — ubah palet warna, font, atau spacing di `:root` pada `css/style.css`. Palet saat ini (gaya "Henry"):
   - Paper (kanvas/kartu): `#fafafa` · Ink (panel gelap/footer): `#2a2722` · Sepia (teks sekunder): `#3e3b36` · Ash (teks muted): `#666666`
   - Hairline (border kartu): `#eeeeee` · Midstone (border muted): `#9f9f9f`
   - Monokrom penuh — tanpa aksen warna. Radius 12px saja, tanpa shadow. Untuk mengubah warna dasar, cukup ubah variabel di `:root`.
4. **Favicon** — ganti `favicon.svg` (vector) lalu regenerate PNG/ICO dari file tersebut bila perlu.

### Mengganti foto hero

Plat hero memakai **dua** berkas: foto asli untuk keadaan diam, dan versi halftone untuk keadaan hover. Yang kedua bukan salinan — ia harus **dibangkitkan** dari yang pertama.

1. Taruh foto baru di `assets/images/home/` (misalnya `foto-baru.jpeg`).
2. Bangkitkan versi halftone-nya:
   ```bash
   pip install pillow numpy
   python3 tools/make-halftone.py \
     --input  assets/images/home/foto-baru.jpeg \
     --output assets/images/home/foto-baru-halftone.png
   ```
3. Perbarui **kedua** path di `data/data.json`:
   ```json
   "IMAGE": "./assets/images/home/foto-baru.jpeg",
   "IMAGE_HALFTONE": "./assets/images/home/foto-baru-halftone.png"
   ```

> ⚠️ **Kalau langkah 2 dilewati**, keadaan hover akan tetap menampilkan halftone dari foto **lama** — dan itu terjadi tanpa pesan error apa pun. Ini kesalahan yang paling mudah terlewat.

Ingin mengubah karakter titiknya? `--tone auto|gentle|raw` mengatur seberapa terbuka bayangannya (`auto` paling aman untuk foto gelap), sementara `--pitch` mengatur ukuran titiknya. Skripnya akan menolak kombinasi `--size`/`--pitch` yang tidak pas dan menjelaskan cara memperbaikinya. Jalankan `python3 tools/make-halftone.py --help` untuk daftar lengkap.

## Deployment

Situs di-hosting di **GitHub Pages** dengan custom domain `bagassandih.my.id` (lihat file `CNAME`). Push ke branch `main` akan otomatis mem-publish perubahan ke:

- https://bagassandih.my.id
- https://bagassandih.github.io/portofolio/

## Contact

- 🌐 Website: [bagassandih.my.id](https://bagassandih.my.id)
- 💼 LinkedIn: [in/bagassandih](https://www.linkedin.com/in/bagassandih)
- 📧 Email: bagassandi13@gmail.com
- 🐙 GitHub: [bagassandih](https://github.com/bagassandih)

---

© 2026 Bagas Arisandi Hidayat. All rights reserved.
