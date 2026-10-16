// ============================================================
// Tema Paper ⇄ Ink
// ============================================================
// Berkas ini mengerjakan dua hal:
//
//   1. Menyetel tema SEBELUM cat pertama. Skripnya dimuat di <head> tanpa
//      `defer`, jadi atribut data-theme sudah terpasang saat stylesheet
//      mulai berlaku — tidak ada kedipan terang di awal bagi yang memilih
//      tema gelap.
//   2. Menyambungkan tombolnya dan menukar berkas halftone setelah DOM siap.
//
// Default-nya SELALU terang. Preferensi sistem tidak diikuti: halaman ini
// memang dirancang sebagai kertas, jadi tema gelap adalah pilihan sadar,
// bukan keadaan yang diwarisi. Yang diingat hanya yang pernah ditekan.
// ============================================================

(function () {
  "use strict";

  var STORAGE_KEY = "henry-theme";
  var LIGHT = "light";
  var DARK = "dark";

  // Warna <meta name="theme-color"> per tema — nilainya harus sama dengan
  // --surface-paper di css/style.css, supaya bilah peramban menyatu dengan
  // kanvas di kedua tema.
  var CHROME_COLOR = { light: "#fafafa", dark: "#2a2722" };

  // Favicon mengikuti tema seperti theme-color dan halftone: versi terang
  // (Ink di atas Paper) untuk tema Paper, dan kebalikannya untuk tema Ink.
  var ICON = { light: "./favicon.svg", dark: "./favicon-ink.svg" };

  // Lama silang-lebur di css/style.css (html.is-theming). Dilepas sedikit
  // lebih lambat dari durasi transisinya supaya tidak terpotong di tengah.
  var CROSSFADE_MS = 400;

  function readStoredTheme() {
    try {
      // Hanya "dark" yang dikenali. Nilai asing apa pun — termasuk sisa versi
      // lama — jatuh ke terang, bukan ke tema yang tidak sengaja.
      return localStorage.getItem(STORAGE_KEY) === DARK ? DARK : LIGHT;
    } catch (error) {
      // localStorage bisa diblokir (mode privat, cookie dimatikan). Itu bukan
      // alasan untuk gagal: tema terang tetap dipakai, hanya tidak diingat.
      return LIGHT;
    }
  }

  var theme = readStoredTheme();

  // --- 1. Sebelum cat pertama ------------------------------------------
  if (theme === DARK) {
    document.documentElement.setAttribute("data-theme", DARK);
  }

  // --- 2. Setelah DOM siap ---------------------------------------------
  function paintChrome() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", CHROME_COLOR[theme]);
  }

  function paintFavicon() {
    var link = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (!link) return;
    var next = ICON[theme];
    if (next && link.getAttribute("href") !== next) link.setAttribute("href", next);
  }

  // Plat hero memakai dua berkas halftone: titik Ink di atas Paper untuk tema
  // terang, dan kebalikannya untuk tema gelap. Path-nya datang dari data.json
  // lewat loadData.js, yang menaruhnya di data-src-terang / data-src-gelap
  // lalu memicu event di bawah — jadi tema.js tidak perlu tahu soal data.json.
  function paintHalftone() {
    var plate = document.querySelector(".hero-plate-halftone");
    if (!plate) return;

    // Cadangan ke versi terang kalau berkas tema gelapnya belum ada — misalnya
    // saat data.json belum sempat diperbarui. Plat yang masih menampilkan
    // halftone lama jauh lebih baik daripada plat yang kosong.
    var next =
      (theme === DARK ? plate.dataset.srcDark : plate.dataset.srcLight) ||
      plate.dataset.srcLight;

    if (next && plate.getAttribute("src") !== next) plate.src = next;
  }

  function paintAria() {
    var button = document.getElementById("nav_theme");
    if (button) button.setAttribute("aria-pressed", theme === DARK ? "true" : "false");
  }

  var crossfadeTimer = null;

  // Silang-lebur dipasang hanya selama pergantian (html.is-theming), lalu
  // dilepas lagi — lihat komentar di css/style.css.
  function crossfade() {
    var root = document.documentElement;
    root.classList.add("is-theming");
    window.clearTimeout(crossfadeTimer);
    crossfadeTimer = window.setTimeout(function () {
      root.classList.remove("is-theming");
    }, CROSSFADE_MS);
  }

  function setTheme(next) {
    theme = next;

    if (next === DARK) {
      document.documentElement.setAttribute("data-theme", DARK);
    } else {
      // Terang adalah keadaan default :root, jadi atributnya dilepas —
      // biar tidak ada dua sumber kebenaran yang bisa berselisih.
      document.documentElement.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      /* Pilihan tidak tersimpan; tema tetap berganti untuk sesi ini. */
    }

    paintChrome();
    paintFavicon();
    paintAria();
    paintHalftone();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("nav_theme");
    if (button) {
      button.addEventListener("click", function () {
        crossfade();
        setTheme(theme === DARK ? LIGHT : DARK);
      });
    }

    paintChrome();
    paintFavicon();
    paintAria();
    paintHalftone();
  });

  // Dipicu loadData.js setelah ia menaruh path halftone di data-src-*.
  document.addEventListener("theme:assets", paintHalftone);
})();
