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

  /* ----------------------------------------------------------
     Pass plat hero di perangkat sentuh
     Di desktop gimik ini hidup dari :hover (lihat css/style.css).
     Layar sentuh tidak punya hover, jadi di sini ia diberi dua jalan
     masuk yang setara: satu pass otomatis saat plat masuk layar — yang
     mengajarkannya tanpa perlu label apa pun — lalu ketukan untuk
     menukarnya bolak-balik. Keadaannya sama persis dengan hover: kelas
     .hero-plate.is-pulled yang sama, geseran 3px yang sama.
     ---------------------------------------------------------- */
  function initPlatePass() {
    // Di desktop hover sudah memegang gimik ini sepenuhnya. Memasang jalur
    // ketuk di sana hanya akan menambah tab-stop dan satu keadaan kedua yang
    // bisa bertabrakan dengan hover.
    if (FINE_POINTER) return;

    const plate = document.getElementById('hero_plate');
    if (!plate) return;

    const HOLD_MS = 1400; // lama pass otomatis bertahan sebelum dilepas
    const SAFETY_MS = 2600; // batas tunggu reveal sebelum pass jalan sendiri

    let autoPassDone = false;
    let holdTimer = 0;
    let safetyTimer = 0;

    const pulled = () => plate.classList.contains('is-pulled');
    const sync = () => plate.setAttribute('aria-pressed', pulled() ? 'true' : 'false');

    const pull = () => {
      plate.classList.add('is-pulled');
      sync();
    };

    const release = () => {
      plate.classList.remove('is-pulled');
      sync();
    };

    // Plat dipromosikan jadi tombol sungguhan supaya bisa dijangkau keyboard
    // dan keadaannya diumumkan. Labelnya datang dari data.json — loadData.js
    // menitipkannya di data-label, dan berkas ini tidak menulis teks apa pun.
    plate.setAttribute('role', 'button');
    plate.setAttribute('tabindex', '0');
    if (plate.dataset.label) plate.setAttribute('aria-label', plate.dataset.label);
    sync();

    const toggle = () => {
      // Ketukan membatalkan pass otomatis, bukan bertengkar dengannya.
      autoPassDone = true;
      window.clearTimeout(holdTimer);
      window.clearTimeout(safetyTimer);
      pulled() ? release() : pull();
    };

    plate.addEventListener('click', toggle);
    plate.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault(); // Space akan menggulir halaman kalau dibiarkan
      toggle();
    });

    // Tanpa gerak tidak ada pass otomatis — tetapi ketukan tetap menukar,
    // sama seperti hover di desktop yang juga tetap menukar saat gerak
    // dimatikan; di sana hanya transisinya yang hilang.
    if (!MOTION_OK) return;

    const startPass = () => {
      window.clearTimeout(safetyTimer);
      if (autoPassDone) return;
      autoPassDone = true;
      pull();
      holdTimer = window.setTimeout(release, HOLD_MS);
    };

    // Pass-nya menunggu reveal plat selesai dulu; kalau tidak, ia bertumpuk
    // dengan plat yang masih memudar masuk dan keduanya saling mengaburkan.
    const revealPending =
      document.documentElement.classList.contains('js-reveal') &&
      !plate.classList.contains('is-visible');

    if (revealPending) {
      plate.addEventListener('animationend', startPass, { once: true });
      // Jaring pengaman: kalau animationend tidak pernah datang, pass-nya
      // tetap berjalan daripada hilang tanpa jejak.
      safetyTimer = window.setTimeout(startPass, SAFETY_MS);
    } else {
      startPass();
    }
  }

  /* ----------------------------------------------------------
     Form kirim pesan — "kirim = pass kedua"
     Menekan kirim bukan memunculkan spinner, melainkan mencetak:
     slip form meleset 3px lalu duduk di register-nya (bahasa cetak
     yang sama dengan sakelar tema), kemudian hasilnya datang sebagai
     lembar proof bertanda potong. Isian yang salah = salah register:
     field-nya meleset bolak-balik 3px dan pesannya muncul di bawah.

     Pengiriman lewat Web3Forms: kunci publik yang hanya merutekan pesan
     ke email terdaftar, jadi aman berada di frontend (beda dari API key
     Resend yang wajib server-side). Sebelum dicetak, lembarannya harus
     disahkan dulu: kotak hCaptcha di ujung form — satu-satunya bagian
     yang bukan milik kita, karena isinya iframe hcaptcha.com.
     ---------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById("contact_form");
    if (!form) return;

    const submit = document.getElementById("contact_submit");
    const submitError = document.getElementById("contact_form_error");
    const proof = document.getElementById("contact_form_proof");
    const proofTitle = document.getElementById("contact_form_success_title");
    const again = document.getElementById("contact_form_again");
    const fields = Array.from(form.querySelectorAll(".contact-form__field"));

    const getInput = (field) => field.querySelector(".contact-form__input");
    const getError = (field) => field.querySelector(".contact-form__error");

    // --- Verifikasi hCaptcha -------------------------------------------
    // Tokennya disuntik hCaptcha ke dalam form saat widgetnya dirender, di
    // medan tersembunyi bernama h-captcha-response. Token itu sekali pakai:
    // tiap percobaan kirim — berhasil maupun gagal — menghabiskannya di
    // server, jadi kotaknya harus dicentang ulang. Karena itu resetCaptcha()
    // dipanggil di kedua ujung, bukan hanya saat "kirim lagi".
    const captchaWidget = form.querySelector(".h-captcha");
    const captchaField = form.querySelector(".contact-form__captcha");
    const captchaError = document.getElementById("contact_captcha_error");

    // Tema kotaknya dititipkan sekarang, selagi widgetnya belum lahir: skrip
    // pemuat Web3Forms di index.html berjalan kapan saja (`async`), tetapi
    // hCaptcha baru merender setelah dua unduhan berantai — jadi praktis
    // selalu kalah cepat dari DOMContentLoaded. hCaptcha memanggang tema saat
    // render dan tidak punya API untuk menggantinya sesudahnya; kalau toh
    // widgetnya telanjur lahir duluan, ia hanya tampil dengan tema bawaannya
    // dan tidak ada yang rusak.
    if (captchaWidget) {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      captchaWidget.dataset.theme = dark ? "dark" : "light";

      // Di layar sempit kotak bawaannya selebar 303px dan tidak muat di
      // dalam kartu — di 320px ia malah ikut melebarkan seluruh halaman.
      // Ukuran compact (164px) muat, dan sama seperti tema di atas ia harus
      // dititipkan sekarang, sebelum hCaptcha merender. Tinggi slotnya juga
      // disesuaikan lewat --captcha-height supaya form tidak melompat saat
      // widget menyusul.
      const room = captchaWidget.parentElement ? captchaWidget.parentElement.clientWidth : 0;
      if (room && room < 303) {
        captchaWidget.dataset.size = "compact";
        captchaWidget.parentElement.style.setProperty("--captcha-height", "144px");
      }
    }

    const captchaToken = () => {
      const field = form.querySelector('[name="h-captcha-response"]');
      return field && field.value ? field.value : "";
    };

    const resetCaptcha = () => {
      if (captchaField) captchaField.classList.remove("is-invalid");
      if (captchaError) captchaError.textContent = "";
      try {
        // Tanpa argumen: hCaptcha mereset widget pertama — di halaman ini
        // memang cuma ada satu. Kalau skripnya diblokir (pemblokir iklan,
        // misalnya) atau belum selesai dimuat, tidak ada yang perlu direset.
        if (window.hcaptcha) window.hcaptcha.reset();
      } catch (error) {
        /* Widget belum siap; kotaknya masih kosong dengan sendirinya. */
      }
    };

    // Garis tinta terisi saat field berisi; pesan error hilang saat mengetik.
    fields.forEach((field) => {
      const input = getInput(field);
      if (!input) return;
      input.addEventListener("input", () => {
        field.classList.toggle("is-filled", input.value.trim().length > 0);
        if (field.classList.contains("is-invalid")) {
          field.classList.remove("is-invalid");
          const error = getError(field);
          if (error) error.textContent = "";
        }
      });
    });

    const showError = (field, message) => {
      // Remove + reflow + add supaya animasi "salah register" bisa diputar ulang.
      field.classList.remove("is-invalid");
      void field.offsetWidth;
      field.classList.add("is-invalid");
      const error = getError(field);
      if (error) error.textContent = message || "";
    };

    const clearErrors = () => {
      fields.forEach((field) => {
        field.classList.remove("is-invalid");
        const error = getError(field);
        if (error) error.textContent = "";
      });
    };

    const validate = () => {
      clearErrors();
      let firstInvalid = null;
      for (const field of fields) {
        const input = getInput(field);
        if (!input || input.disabled) continue;
        const value = input.value.trim();
        let message = "";
        if (!value) {
          message = input.dataset.errorRequired || "";
        } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = input.dataset.errorEmail || "";
        }
        if (message) {
          showError(field, message);
          firstInvalid = firstInvalid || input;
        }
      }
      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    };

    const submitMessage = (payload) => {
      // Web3Forms menerima kunci publik di badan request; kunci itu hanya
      // merutekan ke email terdaftar, jadi aman di frontend. Kuncinya
      // dititipkan loadData.js ke form.dataset.accessKey.
      return fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: form.dataset.accessKey || "",
          name: payload.name,
          email: payload.email,
          message: payload.message,
          subject: form.dataset.subject || "",
          from_name: payload.name,
          botcheck: payload.botcheck || "",
          // Nama medannya milik hCaptcha, jadi ditulis apa adanya di sini —
          // di satu tempat yang memang mengurus bentuk permintaan ke Web3Forms.
          "h-captcha-response": payload.captcha || "",
        }),
      }).then((response) => response.json().then((data) => {
        if (!response.ok || data.success !== true) {
          throw new Error(data.message || `Kirim gagal: ${response.status}`);
        }
      }));
    };

    const setSubmitting = (busy) => {
      if (!submit) return;
      submit.disabled = busy;
      if (busy) submit.textContent = submit.dataset.submitting || submit.textContent;
    };

    const reset = () => {
      form.classList.remove("is-sent");
      proof.hidden = true;
      proof.classList.remove("is-visible");
      setSubmitting(false);
      if (submit) submit.textContent = submit.dataset.label || "";
      if (submitError) submitError.textContent = "";
      form.reset();
      fields.forEach((field) => field.classList.remove("is-filled"));
      resetCaptcha(); // form.reset() tidak menyentuh kotak verifikasi
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      // Bersihkan pesan kegagalan dari percobaan sebelumnya.
      if (submitError) submitError.textContent = "";

      // Honeypot terisi = bot; diam saja, seolah berhasil.
      const honeypot = form.querySelector(".contact-form__honeypot");
      if (honeypot && honeypot.value) return;

      if (!validate()) return;

      // Lembarannya belum disahkan: kotak verifikasi belum dicentang, jadi
      // tokennya kosong. Ini pun salah register — blok verifikasinya ikut
      // meleset 3px seperti field yang salah isi.
      const captcha = captchaToken();
      if (captchaWidget && !captcha) {
        showError(captchaField, form.dataset.errorCaptcha || "");
        return;
      }

      const payload = {
        name: form.querySelector("#contact_name").value.trim(),
        email: form.querySelector("#contact_email").value.trim(),
        message: form.querySelector("#contact_message").value.trim(),
        botcheck: honeypot ? honeypot.value : "",
        captcha: captcha,
      };

      setSubmitting(true);
      form.classList.add("is-printing");

      submitMessage(payload)
        .then(() => {
          form.classList.remove("is-printing");
          form.classList.add("is-sent");
          proof.hidden = false;
          // Reflow dulu supaya animasi proof-in diputar dari awal.
          void proof.offsetWidth;
          proof.classList.add("is-visible");
          if (proofTitle) proofTitle.focus();
        })
        .catch((error) => {
          console.error("Gagal mengirim pesan:", error);
          form.classList.remove("is-printing");
          setSubmitting(false);
          if (submit) submit.textContent = submit.dataset.label || "";
          if (submitError) submitError.textContent = form.dataset.errorSend || "";
          // Token tadi sudah dihabiskan server walau pengirimannya gagal,
          // jadi kotaknya harus dicentang ulang sebelum mencoba lagi.
          resetCaptcha();
        });
    });

    if (again) again.addEventListener("click", reset);
  }

  function init() {
    const steps = [
      ['kursor', initCursor],
      ['scroll rule', initScrollProgress],
      ['marquee', initReactiveMarquee],
      ['reveal', initReveal],
      // Setelah reveal: initPlatePass menunggu animationend reveal pada plat,
      // jadi observer-nya harus sudah terpasang lebih dulu.
      ['pass plat', initPlatePass],
      ['form kontak', initContactForm],
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
