// Memanggil fungsi loadData setelah halaman dimuat, lalu pasang semua rail geser
// dan daftarkan kartu yang baru dirender ke observer reveal.
loadData().then(() => {
  initRails();
  window.refreshReveal?.();
});

/* ============================================================
   Menu mobile — panel Ink yang menyapu turun
   Satu fungsi `setMenu` yang menyalakan seluruh state (kelas panel,
   ikon tombol, dan aria-expanded) supaya tidak pernah ada kondisi
   setengah terbuka. Panel bisa ditutup lewat tombol, Escape, klik di
   luar, atau setelah memilih salah satu tujuan.
   ============================================================ */
const navToggle = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-links');

function setMenu(open) {
  navMenu.classList.toggle('show-menu', open);
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
}

const menuOpen = () => navMenu.classList.contains('show-menu');

navToggle.addEventListener('click', () => setMenu(!menuOpen()));

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !menuOpen()) return;
  setMenu(false);
  navToggle.focus();
});

// Klik di luar header menutup panel
document.addEventListener('click', (event) => {
  if (!menuOpen()) return;
  if (navToggle.contains(event.target) || navMenu.contains(event.target)) return;
  setMenu(false);
});

// Setelah memilih tujuan, panelnya ditutup lagi
navMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

/* ============================================================
   Jalur geser kanan/kiri (Work Experience & Selected Works)
   Tombol panah, drag dengan mouse, dan swipe sentuh (native).
   Tombol disembunyikan kalau isinya belum meluap (tidak perlu digeser).
   Tiap rail dipasangkan ke tombolnya lewat [data-rail-nav-for="<id rail>"].
   ============================================================ */
function initRails() {
  document.querySelectorAll('.card-container--rail').forEach((track) => {
    if (!track.id) return;
    const nav = document.querySelector(`.rail-nav[data-rail-nav-for="${track.id}"]`);
    if (!nav) return;

    const prevButton = nav.querySelector('[data-rail="prev"]');
    const nextButton = nav.querySelector('[data-rail="next"]');

    // Satu langkah geser = lebar satu kartu + jarak antar kolom
    const stepSize = () => {
      const card = track.querySelector('.card-item');
      if (!card) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    const syncButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const scrollable = maxScroll > 1;
      nav.hidden = !scrollable;
      prevButton.disabled = !scrollable || track.scrollLeft <= 1;
      nextButton.disabled = !scrollable || track.scrollLeft >= maxScroll - 1;
    };

    prevButton.addEventListener('click', () => track.scrollBy({ left: -stepSize(), behavior: 'smooth' }));
    nextButton.addEventListener('click', () => track.scrollBy({ left: stepSize(), behavior: 'smooth' }));
    track.addEventListener('scroll', syncButtons, { passive: true });
    window.addEventListener('resize', syncButtons);

    // Drag dengan mouse — swipe sentuh sudah ditangani browser
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    const endDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture?.(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    };

    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 4) moved = true;
      track.scrollLeft = startScroll - delta;
    });

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    // Buang klik yang tidak sengaja terpicu setelah drag
    track.addEventListener(
      'click',
      (event) => {
        if (!moved) return;
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      },
      true
    );

    syncButtons();
  });
}
