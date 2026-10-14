// Ubah judul menjadi slug, dipakai untuk id rail pengalaman supaya tiap grup
// punya nama yang stabil. contoh: "Contract / Professional" -> "contract-professional"
function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fungsi untuk mengambil dan menampilkan data dari file JSON
async function loadData() {
  try {
    // const response = await fetch("https://raw.githubusercontent.com/bagassandih/portofolio/refs/heads/main/data/data.json"); // pages
    const response = await fetch("./data/data.json"); // locals
    const responseJson = await response.json();
    const jsonData = responseJson[0];

    // PROFILE — identitas, judul halaman, dan masthead
    profileSection(jsonData);

    // NAVIGASI — tautan menu dan tombol CTA
    navSection(jsonData);

    // SECTION TITLES
    sectionsSection(jsonData);

    // LABELS — teks UI yang berdiri sendiri
    labelsSection(jsonData);

    // HOME SECTION
    homeSection(jsonData);

    // TECH TICKER (marquee of the stack)
    tickerSection(jsonData);

    // EXPERIENCE SECTION
    experienceSection(jsonData);

    // EDUCATION SECTION
    educationSection(jsonData);

    // HARDSKILL SECTION
    hardSkillSection(jsonData);

    // SOFTSKILL SECTION
    softSkillElement(jsonData);

    // OTHER SKILL SECTION
    otherSkillSection(jsonData);

    // PROJECT SECTION
    projectSection(jsonData);

    // CONTACT SECTION
    contactSection(jsonData);
  } catch (error) {
    console.error("Gagal memuat data JSON:", error);
  }
}

function homeSection(data) {
  try {
    if (!data?.HOME) throw new Error("Data HOME tidak ditemukan");

    const homeDescription = document.getElementById("home_description");
    homeDescription.textContent = data.HOME.DESCRIPTION;

    document.getElementById("download-btn").addEventListener("click", function () {
      fetch(data.HOME.RESUME)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = data.HOME.RESUME.split('/').pop();
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => console.error("Error downloading the file:", error));
    });
  } catch (error) {
    console.error("Gagal mengambil data HOME:", error);
  }
}

// Setel teks sebuah elemen lewat id. Elemen atau nilai yang kosong dilewati
// diam-diam supaya satu field yang belum ada di data.json tidak mematikan
// seluruh halaman.
function setText(id, text) {
  const element = document.getElementById(id);
  if (element && text != null) element.textContent = text;
}

function profileSection(data) {
  try {
    const profile = data?.PROFILE;
    if (!profile) throw new Error("Data PROFILE tidak ditemukan");

    // Judul tab dan meta description ikut data, bukan ditulis di index.html
    document.title = `${profile.NAME} — ${profile.ROLE}`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", profile.META_DESCRIPTION || "");

    // Banner pengumuman paling atas
    const banner = document.getElementById("ticker_banner");
    if (banner) {
      banner.innerHTML = `<span>${profile.ROLE}</span><span>${profile.AVAILABILITY}</span>`;
    }

    setText("nav_title", profile.NAME);
    setText("hero_eyebrow", profile.ROLE);

    // Baris ketersediaan yang menutup band Contact. Sumbernya sama dengan
    // banner di atas — satu fakta, satu field.
    setText("contact_availability", profile.AVAILABILITY);

    // Nama hero dipecah dua bagian: lead (roman) dan accent (italic) yang
    // saling bertukar gaya saat di-hover. Pecahannya ditentukan di data.json
    // supaya bukan hasil tebakan "kata terakhir".
    const heroName = document.getElementById("hero_name");
    if (heroName) {
      heroName.innerHTML =
        `<span class="hero-name-lead">${profile.NAME_LEAD}</span><br><em>${profile.NAME_ACCENT}</em>`;
    }

    // Foto hero: HOME.IMAGE untuk keadaan diam (foto asli, tanpa filter) dan
    // HOME.IMAGE_HALFTONE untuk keadaan hover. Alt hanya di lapisan foto —
    // lapisan halftone hiasan belaka, jadi aria-hidden di index.html.
    const heroPhoto = document.querySelector(".hero-plate-photo");
    if (heroPhoto) {
      if (data?.HOME?.IMAGE) heroPhoto.src = data.HOME.IMAGE;
      heroPhoto.alt = `Foto ${profile.NAME}`;
    }

    // Dua versi halftone, satu per tema: titik Ink di atas Paper untuk tema
    // terang, dan versi terbaliknya untuk tema gelap. Keduanya hanya dititipkan
    // di data-src-* di sini; yang memilih dan memasangnya ke src adalah
    // js/theme.js, karena hanya ia yang tahu tema mana yang sedang berlaku.
    const heroHalftone = document.querySelector(".hero-plate-halftone");
    if (heroHalftone) {
      heroHalftone.dataset.srcLight = data?.HOME?.IMAGE_HALFTONE || "";
      heroHalftone.dataset.srcDark = data?.HOME?.IMAGE_HALFTONE_INK || "";
      document.dispatchEvent(new Event("theme:assets"));
    }
  } catch (error) {
    console.error("Gagal mengambil data PROFILE:", error);
  }
}

function navSection(data) {
  try {
    const nav = data?.NAV;
    if (!nav) throw new Error("Data NAV tidak ditemukan");

    const list = document.getElementById("nav_links");
    if (list) {
      list.innerHTML = (nav.LINKS || [])
        .map((link) => `<li><a href="#" onclick="scrollElement('${link.TARGET}')">${link.LABEL}</a></li>`)
        .join("");
    }

    setText("nav_cta", nav.CTA);
  } catch (error) {
    console.error("Gagal mengambil data NAV:", error);
  }
}

function sectionsSection(data) {
  try {
    const sections = data?.SECTIONS || {};
    setText("section_title_experience", sections.EXPERIENCE);
    setText("section_title_education", sections.EDUCATION);
    setText("section_title_skills", sections.SKILLS);
    setText("section_title_project", sections.PROJECT);
    setText("section_title_contact", sections.CONTACT);
  } catch (error) {
    console.error("Gagal mengambil data SECTIONS:", error);
  }
}

function labelsSection(data) {
  try {
    const labels = data?.LABELS || {};
    setText("label_skill_hard", labels.SKILL_HARD);
    setText("label_skill_other", labels.SKILL_OTHER);
    setText("label_skill_soft", labels.SKILL_SOFT);
    // Tombol resume memakai id "download-btn" karena listener-nya dipasang
    // homeSection(); teksnya tetap datang dari LABELS.
    setText("download-btn", labels.HERO_CTA_PRIMARY);
    setText("hero_cta_secondary", labels.HERO_CTA_SECONDARY);
    setText("contact_get_in_touch", labels.CONTACT_GET_IN_TOUCH);
    setText("contact_note", labels.CONTACT_NOTE);
    setText("footer_back_to_top", labels.FOOTER_BACK_TO_TOP);

    // Sakelar tema — kata "Mode", dua nama tema yang terlihat, dan satu label
    // untuk pembaca layar (keadaan aktifnya diumumkan lewat aria-pressed di
    // js/theme.js).
    setText("nav_theme_label", labels.THEME_MODE);
    setText("nav_theme_paper", labels.THEME_PAPER);
    setText("nav_theme_ink", labels.THEME_INK);
    const themeButton = document.getElementById("nav_theme");
    if (themeButton && labels.THEME_SWITCH) {
      themeButton.setAttribute("aria-label", labels.THEME_SWITCH);
    }

    // Label untuk plat hero saat ia menjadi tombol. Dititipkan sebagai
    // data-label, bukan langsung aria-label: di desktop platnya bukan tombol,
    // dan aria-label pada <div> biasa tidak sah. Yang mempromosikannya jadi
    // aria-label adalah js/interactions.js, dan hanya di perangkat sentuh —
    // pola yang sama dengan data-src-* milik halftone di theme.js.
    //
    // Dua arah perlu ditangani: interactions.js jalan di DOMContentLoaded,
    // sedangkan fetch data ini selesai sesudahnya — jadi biasanya data-label
    // tiba terlambat dan justru di sini labelnya harus dipasang. Kalau
    // urutannya kebetulan terbalik, data-label yang mengambil alih.
    const heroPlate = document.getElementById("hero_plate");
    if (heroPlate && labels.PLATE_TOGGLE) {
      heroPlate.dataset.label = labels.PLATE_TOGGLE;
      if (heroPlate.getAttribute("role") === "button") {
        heroPlate.setAttribute("aria-label", labels.PLATE_TOGGLE);
      }
    }
    setText("footer_copyright", `© ${new Date().getFullYear()} ${data?.PROFILE?.NAME || ""}`);
  } catch (error) {
    console.error("Gagal mengambil data LABELS:", error);
  }
}

function tickerSection(data) {
  try {
    const track = document.getElementById("tech_ticker_track");
    if (!track) return;
    const items = (data?.HARDSKILLS || []).map((s) => s.TITLE);
    if (!items.length) return;

    const row = items
      .map(
        (title) =>
          `<span class="tech-item"><span class="tech-word">${title}</span><span class="tech-dash">—</span></span>`
      )
      .join("");

    // Dua salinan identik agar loop marquee mulus (translateX -50%).
    track.innerHTML = row + row;
  } catch (error) {
    console.error("Gagal mengambil data ticker:", error);
  }
}

function experienceSection(data) {
  try {
    if (!data?.EXPERIENCES) throw new Error("Data EXPERIENCES tidak ditemukan");

    const experienceElement = document.getElementById("experience_list");
    if (!experienceElement) return;

    // data.EXPERIENCES sudah berbentuk sub-section: [{ TITLE, ITEMS: [...] }, ...]
    experienceElement.innerHTML = data.EXPERIENCES
      .filter((group) => group.ITEMS?.length)
      .map((group) => {
        const trackId = `experience_list_${slugify(group.TITLE)}`;

        const cards = group.ITEMS
          .map((experience) => {
            return `
          <div class="card-item">
            <div class="card-title">
              <img class="card-logo${experience.SOLID_BG ? " logo--tile" : ""}" src="${experience.IMAGE}" alt="Logo ${experience.COMPANY}">
              <div class="card-heading">
                <h3 class="card-title-company">${experience.COMPANY}</h3>
                <span class="card-period">${experience.PERIOD}</span>
              </div>
            </div>

            <div class="card-description">
              ${experience.SKILL.map((skill) => `<span class="skills">${skill}</span>`).join("")}
            </div>
          </div>
          `;
          })
          .join("");

        return `
        <div class="experience-group reveal">
          <div class="experience-group-head">
            <h3 class="experience-group-title">${group.TITLE}</h3>
            <div class="rail-nav" data-rail-nav-for="${trackId}">
              <button type="button" class="rail-btn" data-rail="prev" aria-controls="${trackId}"
                aria-label="Geser ${group.TITLE} ke kiri">←</button>
              <button type="button" class="rail-btn" data-rail="next" aria-controls="${trackId}"
                aria-label="Geser ${group.TITLE} ke kanan">→</button>
            </div>
          </div>
          <div class="card-container card-container--rail" id="${trackId}" tabindex="0"
            aria-label="Pengalaman ${group.TITLE}, geser ke kanan atau kiri">${cards}</div>
        </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Gagal mengambil data EXPERIENCES:", error);
  }
}

function educationSection(data) {
  try {
    if (!data?.EDUCATIONS) throw new Error("Data EDUCATIONS tidak ditemukan");

    const eduElement = document.getElementById("education_list");
    data.EDUCATIONS.forEach((education) => {
      const educationImage = education.IMAGE
        ? `<img class="education-image" src="${education.IMAGE}" alt="Logo ${education.COMPANY}">`
        : "";

      eduElement.innerHTML += `
           <div class="education-item reveal">
            ${educationImage}
            <h3>${education.COMPANY}</h3>
            <p class="education-program">${education.TITLE}</p>
            <div class="education-meta">
              <span class="education-period">${education.PERIOD}</span>
              <span class="education-tag">${education.TYPE}</span>
            </div>
          </div>
          `;
    });
  } catch (error) {
    console.error("Gagal mengambil data EDUCATIONS:", error);
  }
}

function hardSkillSection(data) {
  try {
    if (!data?.HARDSKILLS) throw new Error("Data HARDSKILLS tidak ditemukan");

    const hardSkillElement = document.getElementById("hardskill_list");
    data.HARDSKILLS.forEach((hardSkill) => {
      hardSkillElement.innerHTML += `
           <div>
            <span class="logo-chip">
              <img class="logo${hardSkill.SILHOUETTE ? " logo--silhouette" : ""}" src="${hardSkill.IMAGE}" alt="${hardSkill.TITLE}">
            </span>
            <p>${hardSkill.TITLE}</p>
          </div>
          `;
    });
  } catch (error) {
    console.error("Gagal mengambil data HARDSKILLS:", error);
  }
}

function softSkillElement(data) {
  try {
    if (!data?.SOFTSKILLS) throw new Error("Data SOFTSKILLS tidak ditemukan");

    const softSkillElement = document.getElementById("softskill_list");
    data.SOFTSKILLS.forEach((softSkill) => {
      softSkillElement.innerHTML += `
          <div>
            <span class="softskill">${softSkill.TITLE}</span>
          </div>
          `;
    });
  } catch (error) {
    console.error("Gagal mengambil data SOFTSKILLS:", error);
  }
}

function otherSkillSection(data) {
  try {
    if (!data?.OTHERSKILLS) throw new Error("Data OTHERSKILLS tidak ditemukan");

    const otherElement = document.getElementById("other_list");
    data.OTHERSKILLS.forEach((otherSkill) => {
      otherElement.innerHTML += `
           <div>
            <span class="logo-chip">
              <img class="logo${otherSkill.SILHOUETTE ? " logo--silhouette" : ""}" src="${otherSkill.IMAGE}" alt="${otherSkill.TITLE}">
            </span>
            <p>${otherSkill.TITLE}</p>
          </div>
          `;
    });
  } catch (error) {
    console.error("Gagal mengambil data OTHERSKILLS:", error);
  }
}

function projectSection(data) {
  try {
    if (!data?.PROJECTS) throw new Error("Data PROJECTS tidak ditemukan");

    const projectElement = document.getElementById("project_list");
    data.PROJECTS.forEach((project) => {
      projectElement.innerHTML += `
         <div class="card-item" onclick="openLink('${project.LINK}')">
          <img class="project-thumb" src="${project.IMAGE}" alt="Tangkapan layar ${project.TITLE}">
          <div class="project-body">
            <h3 class="card-title-company">${project.TITLE}</h3>
            <p>
              ${project.DESCRIPTION}
            </p>
            <div class="card-description">
            ${project.SKILLS.map((skill) => {
              return `<span class="skills">${skill}</span>`;
            }).join("")}
            </div>
          </div>
        </div>
          `;
    });
  } catch (error) {
    console.error("Gagal mengambil data PROJECTS:", error);
  }
}

function contactSection(data) {
  try {
    if (!data?.CONTACTS) throw new Error("Data CONTACTS tidak ditemukan");

    const contactElement = document.getElementById("contact_list");
    data.CONTACTS.forEach((contact) => {
      const logo = `<img class="contact-logo${contact.SILHOUETTE ? " logo--silhouette" : ""}" src="${contact.IMAGE}" alt="${contact.TITLE}">`;

      if (contact.TITLE === "Gmail") {
        contactElement.innerHTML += `
            <button class="contact-link" aria-label="${contact.TITLE}" data-swal-toast-template="#send-email" onclick="triggerSwal('${contact.LINK}')">${logo}</button>
            `;
      } else {
        contactElement.innerHTML += `
            <button class="contact-link" aria-label="${contact.TITLE}" onclick="openLink('${contact.LINK}')">${logo}</button>
            `;
      }
    });

    const contactDescription = document.getElementById("contact_description");
    contactDescription.textContent = data.CONTACT_DESCRIPTION;
  } catch (error) {
    console.error("Gagal mengambil data CONTACTS:", error);
  }
}
