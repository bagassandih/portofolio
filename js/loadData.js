// Ubah judul menjadi slug agar tiap logo bisa ditarget dari CSS
// contoh: "Claude Code (Vibe Code)" -> "claude-code-vibe-code"
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
              <img class="card-logo logo-${slugify(experience.COMPANY)}" src="${experience.IMAGE}" alt="Logo ${experience.COMPANY}">
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
        <div class="experience-group" data-group="${slugify(group.TITLE)}">
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
        ? `<img class="education-image logo-${slugify(education.COMPANY)}" src="${education.IMAGE}" alt="Logo ${education.COMPANY}">`
        : "";

      eduElement.innerHTML += `
           <div class="education-item">
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
            <img class="logo logo-${slugify(hardSkill.TITLE)}" src="${hardSkill.IMAGE}" alt="${hardSkill.TITLE}">
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
            <img class="logo logo-${slugify(otherSkill.TITLE)}" src="${otherSkill.IMAGE}" alt="${otherSkill.TITLE}">
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
      const logo = `<img class="contact-logo contact-${slugify(contact.TITLE)}" src="${contact.IMAGE}" alt="${contact.TITLE}">`;

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
