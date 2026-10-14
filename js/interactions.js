/* ============================================================
   Henry — Interactions & gimmicks
   Monokrom dan on-brand: inversi Paper↔Ink, type, marquee, dan
   nuansa cetak. Tidak menambah warna, shadow, glow, atau gradient.
   Semua gerak tunduk pada prefers-reduced-motion.
   ============================================================ */

(function () {
  'use strict';

  const MOTION_OK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ----------------------------------------------------------
     Kursor ink — tanda registrasi + bingkai yang tertinggal
     Kursor bawaan tetap tampil; ini lapisan tambahan di atasnya.
     ---------------------------------------------------------- */
  function initCursor() {
    if (!FINE_POINTER || !MOTION_OK) return;

    const mark = document.createElement('div');
    mark.className = 'cursor-mark';
    mark.setAttribute('aria-hidden', 'true');

    const frame = document.createElement('div');
    frame.className = 'cursor-frame';
    frame.setAttribute('aria-hidden', 'true');
    const frameBox = document.createElement('span');
    frameBox.className = 'cursor-frame__box';
    frame.appendChild(frameBox);

    document.body.append(mark, frame);

    // Elemen yang membuat bingkai membesar saat disentuh kursor
    const GROW = 'a, button, .card-item, .education-item, .contact-link, .rail-btn, input, textarea, select, [role="button"]';

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let markX = pointerX;
    let markY = pointerY;
    let frameX = pointerX;
    let frameY = pointerY;
    let active = false;

    window.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType !== 'mouse') return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (active) return;
        // Muncul pertama kali: langsung di posisi kursor, tanpa meluncur dari tengah
        active = true;
        markX = frameX = pointerX;
        markY = frameY = pointerY;
        mark.classList.add('is-visible');
        frame.classList.add('is-visible');
      },
      { passive: true }
    );

    document.documentElement.addEventListener('pointerleave', () => {
      active = false;
      mark.classList.remove('is-visible');
      frame.classList.remove('is-visible');
    });

    document.addEventListener(
      'pointerover',
      (event) => {
        const target = event.target;
        const hit = target instanceof Element ? target.closest(GROW) : null;
        frame.classList.toggle('is-grow', Boolean(hit));
      },
      { passive: true }
    );

    // Salib mengikuti rapat (presisi), bingkai menyusul (gaya)
    const render = () => {
      markX += (pointerX - markX) * 0.5;
      markY += (pointerY - markY) * 0.5;
      frameX += (pointerX - frameX) * 0.14;
      frameY += (pointerY - frameY) * 0.14;

      mark.style.transform = `translate3d(${markX}px, ${markY}px, 0)`;
      frame.style.transform = `translate3d(${frameX}px, ${frameY}px, 0)`;

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  /* ----------------------------------------------------------
     Scroll rule — garis ink 1px yang mengisi sesuai posisi baca
     ---------------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');

    const fill = document.createElement('span');
    fill.className = 'scroll-progress__fill';
    bar.appendChild(fill);

    document.body.appendChild(bar);

    let queued = false;

    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      fill.style.transform = `scaleX(${ratio})`;
    };

    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
  }

  /* ----------------------------------------------------------
     Marquee reaktif — ticker ikut arah & kecepatan scroll
     Jalur digeser via rAF (bukan animasi CSS) supaya kecepatan
     bisa berubah tanpa lompatan posisi.
     ---------------------------------------------------------- */
  function initReactiveMarquee() {
    if (!MOTION_OK) return;

    const ticker = document.querySelector('.tech-ticker');
    const track = document.querySelector('.tech-ticker-track');
    if (!ticker || !track) return;

    // Ambil alih dari animasi CSS (lihat .tech-ticker-track.is-driven)
    track.classList.add('is-driven');

    const BASE = 0.018; // % per frame saat diam — setara loop 46s
    const REACT = 0.012; // seberapa kuat scroll mendorong laju
    const EASE = 0.12; // pelunakan dorongan itu

    let offset = 0; // % dari lebar track; satu salinan = 50%
    let boost = 0;
    let prevTime = 0;
    let lastScrollY = window.scrollY;
    let rafId = 0;
    let running = false;
    let inView = false;

    const tick = (now) => {
      if (!running) return;

      const frames = prevTime ? Math.min((now - prevTime) / 16.667, 4) : 1;
      prevTime = now;

      const scrollY = window.scrollY;
      boost += ((scrollY - lastScrollY) * REACT - boost) * EASE;
      lastScrollY = scrollY;

      offset -= BASE * frames + boost * frames;

      // Bungkus dalam satu salinan (-50%..0] supaya loop mulus
      offset %= 50;
      if (offset > 0) offset -= 50;

      track.style.transform = `translate3d(${offset}%, 0, 0)`;

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      prevTime = 0;
      lastScrollY = window.scrollY;
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const sync = () => {
      if (inView && !document.hidden) start();
      else stop();
    };

    // Hanya berjalan saat ticker terlihat & tab aktif
    new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0 }
    ).observe(ticker);

    document.addEventListener('visibilitychange', sync);
  }

  /* ----------------------------------------------------------
     Reveal saat scroll
     Kelas .reveal sudah ada di markup; html.js-reveal baru
     dipasang setelah observer siap, jadi kalau gagal konten
     tetap tampil.
     ---------------------------------------------------------- */
  function initReveal() {
    if (!MOTION_OK || !('IntersectionObserver' in window)) return;

    const root = document.documentElement;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );

    // Pindai ulang dipakai lagi setelah konten dinamis dirender
    const scan = () => {
      const pending = document.querySelectorAll('.reveal:not([data-reveal-bound])');

      pending.forEach((element) => {
        element.setAttribute('data-reveal-bound', '');

        const explicit = element.getAttribute('data-reveal-delay');
        if (explicit !== null) {
          element.style.setProperty('--reveal-delay', `${parseInt(explicit, 10) || 0}ms`);
        } else {
          // Tanpa delay eksplisit: bertahap mengikuti urutan saudaranya
          const siblings = element.parentElement
            ? Array.from(element.parentElement.children).filter((node) =>
                node.classList.contains('reveal')
              )
            : [];
          const index = Math.min(Math.max(siblings.indexOf(element), 0), 4);
          element.style.setProperty('--reveal-delay', `${index * 70}ms`);
        }

        observer.observe(element);
      });
    };

    try {
      root.classList.add('js-reveal');
      scan();
    } catch (error) {
      root.classList.remove('js-reveal');
      console.error('Gagal menyiapkan reveal:', error);
    }

    window.refreshReveal = scan;
  }

  function init() {
    const steps = [
      ['kursor', initCursor],
      ['scroll rule', initScrollProgress],
      ['marquee', initReactiveMarquee],
      ['reveal', initReveal],
    ];

    steps.forEach(([label, run]) => {
      try {
        run();
      } catch (error) {
        console.error(`Gagal menyiapkan ${label}:`, error);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
