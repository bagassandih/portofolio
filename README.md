# Portfolio — Bagas Arisandi Hidayat

<div align="center">

**Backend Developer** · Node.js · Go · PHP (Laravel/Lumen) · Building scalable, high-performance systems

🌐 **Live:** [bagassandih.my.id](https://bagassandih.my.id) · [bagassandih.github.io/portofolio](https://bagassandih.github.io/portofolio/)

</div>

---

## Overview

Personal portfolio website yang menampilkan pengalaman kerja, pendidikan, keahlian, dan proyek sebagai seorang **Backend Developer**. Situs ini adalah _single-page_ statis yang ringan — tanpa build step dan tanpa framework — dibangun murni dengan **HTML**, **CSS**, dan **vanilla JavaScript**.

Seluruh konten dirender di sisi klien dari satu sumber data JSON (`data/data.json`), sehingga isi situs dan kode dipisahkan secara rapi. Untuk mengubah konten, cukup edit file JSON-nya.

## Features

- 🚀 **Sepenuhnya statis** — cepat, tidak ada server-side rendering, mudah di-hosting di mana saja.
- 📦 **Data-driven** — seluruh konten (bio, pengalaman, skill, proyek, kontak) dimuat dari `data/data.json`.
- 📱 **Responsive** — layout menyesuaikan dari mobile hingga desktop, dengan menu hamburger.
- 📄 **Download resume** — tombol untuk mengunduh resume (PDF) langsung dari situs.
- ✉️ **Kontak email** — toast SweetAlert2 menampilkan alamat email saat kartu Gmail diklik.
- 🎨 **Animasi & transisi** — hover effects, gradient brand, dan smooth-scroll navigation.
- 🖼️ **Favicon lengkap** — SVG, PNG, ICO, dan `apple-touch-icon` dengan identitas brand.
- ♿ **Aksesibel & SEO-friendly** — meta description, `theme-color`, dan semantic HTML.

## Tech Stack

| Layer        | Teknologi |
| ------------ | --------- |
| Markup       | HTML5 |
| Styling      | CSS3 (CSS custom properties, flexbox, `column-count` masonry) |
| Logic        | Vanilla JavaScript (ES6+) |
| Data         | JSON (`data/data.json`) |
| Fonts        | [Lexend Exa](https://fonts.google.com/specimen/Lexend+Exa) & [Pacifico](https://fonts.google.com/specimen/Pacifico) (Google Fonts) |
| Libraries    | [SweetAlert2](https://sweetalert2.github.io/) |
| Hosting      | GitHub Pages (custom domain via `CNAME`) |

## Sections

1. **Home** — nama, role, deskripsi singkat, foto, tombol _Download Resume_ & _Contact Me_.
2. **Work Experience** — riwayat pekerjaan beserta tech stack tiap posisi.
3. **Education** — pendidikan formal, bootcamp, dan kursus online.
4. **Skills** — dibagi menjadi _Hardskill_, _Other Skills_, dan _Softskill_.
5. **Project** — kartu proyek (klik untuk membuka repository/demo).
6. **Contact** — LinkedIn, YouTube, Instagram, Gmail, dan GitHub.

## Project Structure

```
portofolio/
├── index.html          # Struktur utama halaman (semantic HTML)
├── css/
│   └── style.css       # Seluruh styling & responsive design
├── js/
│   ├── loadData.js     # Fetch data.json & render tiap section
│   ├── utilities.js    # Helper: openLink, scroll, toast email
│   └── index.js        # Init + hamburger menu
├── data/
│   └── data.json       # Semua konten situs (single source of truth)
├── assets/
│   ├── docs/           # Resume (PDF)
│   └── images/         # Gambar (home, experiences, projects, skills, contacts)
├── favicon.svg         # Favicon vector (primary)
├── favicon.ico         # Favicon multi-size (legacy)
├── apple-touch-icon.png
├── android-chrome-*.png
├── site.webmanifest    # PWA manifest & theme color
└── CNAME               # Custom domain (bagassandih.my.id)
```

## Getting Started

Tidak ada dependency yang perlu di-install. Kamu hanya perlu menjalankan server statis agar `fetch` JSON bekerja (protokol `file://` umumnya diblokir oleh browser).

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
2. **Gambar & resume** — letakkan file di `assets/images/` atau `assets/docs/`, lalu perbarui path di `data.json`.
3. **Tampilan** — ubah palet warna, font, atau spacing di `:root` pada `css/style.css`. Brand color saat ini:
   - Primary dark: `#1A2130` · Primary: `#27374D`
   - Secondary: `#526D82` · Accent: `#9DB2BF` · Light: `#DDE6ED`
4. **Favicon** — ganti `favicon.svg` (vector) lalu regenerate PNG/ICO dari file tersebut bila perlu.

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
