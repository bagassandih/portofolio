// Fungsi untuk mengambil dan menampilkan data dari file JSON
async function loadData() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/bagassandih/portofolio/refs/heads/main/data/data.json"); // pages
    // const response = await fetch("data/data.json"); // locals
    const responseJson = await response.json();
    const jsonData = responseJson[0];

    // HOME SECTION
    homeSection(jsonData);

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

    const homeImage = document.getElementById("home_image");
    homeImage.src = data.HOME.IMAGE;
  } catch (error) {
    console.error("Gagal mengambil data HOME:", error);
  }
}

function experienceSection(data) {
  try {
    if (!data?.EXPERIENCES) throw new Error("Data EXPERIENCES tidak ditemukan");

    const experienceElement = document.getElementById("experience_list");
    data.EXPERIENCES.forEach((experience) => {
      experienceElement.innerHTML += `
          <div class="card-item">
          <div class="card-title">
            <img src="${experience.IMAGE}">
            <span class="card-title-company">${experience.COMPANY}</span>
            <span class="card-title-company">${experience.PERIOD}</span>
          </div>
  
          <div class="card-description">
            ${experience.SKILL.map((skill) => {
              return `<button class="skills">${skill}</button>`;
            }).join("")}
          </div>
        </div>
          `;
    });
  } catch (error) {
    console.error("Gagal mengambil data EXPERIENCES:", error);
  }
}

function educationSection(data) {
  try {
    if (!data?.EDUCATIONS) throw new Error("Data EDUCATIONS tidak ditemukan");

    const eduElement = document.getElementById("education_list");
    data.EDUCATIONS.forEach((education) => {
      eduElement.innerHTML += `
           <div class="education-item">
            <button class="education-place">${education.TITLE}</button>
            <h2>${education.COMPANY}</h2>
            <span class="education-title">
              ${education.PERIOD} <br>
              <b>${education.TYPE}</b>
            </span>
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
            <img src="${hardSkill.IMAGE}">
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
            <button>${softSkill.TITLE}</button>
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
            <img src="${otherSkill.IMAGE}">
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
          <div class="card-title">
            <img src="${project.IMAGE}">
            <span class="card-title-company">${project.TITLE}</span>
            <p>
              ${project.DESCRIPTION}
            </p>
          </div>
  
          <div class="card-description">
          ${project.SKILLS.map((skill) => {
            return `<button class="skills">${skill}</button>`;
          }).join("")}
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
      if (contact.TITLE === "Gmail") {
        contactElement.innerHTML += `
            <div data-swal-toast-template="#send-email" onclick="triggerSwal('${contact.LINK}')">
              <img src="${contact.IMAGE}">
              <p>${contact.TITLE}</p>
            </div>
            `;
      } else if (contact.TITLE !== "Youtube Channel") {
        // youtube channel temporary unactived
        contactElement.innerHTML += `
            <div onclick="openLink('${contact.LINK}')">
              <img src="${contact.IMAGE}">
              <p>${contact.TITLE}</p>
            </div>
            `;
      }
    });

    const contactDescription = document.getElementById("contact_description");
    contactDescription.textContent = data.CONTACT_DESCRIPTION;
  } catch (error) {
    console.error("Gagal mengambil data CONTACTS:", error);
  }
}
