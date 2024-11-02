 // Fungsi untuk mengambil dan menampilkan data dari file JSON
 async function loadData() {
  try {
    // const response = await fetch('https://api.jsonbin.io/v3/b/6720cac2acd3cb34a89ef0d5', {
      //   method: 'GET',
      //   headers: {
        //     'X-Master-Key': '$2a$10$y0yij.uk2mrCYKZoyflJaOuW00tELwdh3wvXRPAVue3/Nec3p.AFm',
        //     'Content-Type': 'application/json'
        //   }});
        
      const response = await fetch('https://raw.githubusercontent.com/bagassandih/portofolio/refs/heads/main/data/data.json'); // pages
      // const response = await fetch('data/data.json'); // locals
      const responseJson = await response.json();
      const jsonData = responseJson[0];

      // HOME SECTION 
      // Description
      const homeDescription = document.getElementById('home_description');
      homeDescription.textContent = jsonData.HOME.DESCRIPTION;

      // Image
      const homeImage = document.getElementById('home_image');
      homeImage.src = jsonData.HOME.IMAGE;
      ////////////////////////////////////////////////////////

      // EXPERIENCE SECTION
      const experienceElement = document.getElementById('experience_list');
      jsonData.EXPERIENCES.forEach(experience => {
        experienceElement.innerHTML += `
        <div class="card-item">
        <div class="card-title">
          <img src="${experience.IMAGE}">
          <span class="card-title-company">${experience.COMPANY}</span>
          <span class="card-title-company">${experience.PERIOD}</span>
        </div>

        <div class="card-description">
          ${experience.SKILL.map(skill => {
            return `<button class="skills">${skill}</button>`;
          }).join('')}
        </div>
      </div>
        `;
      });
      ////////////////////////////////////////////////////////

      // EDUCTAION SECTION
      const eduElement = document.getElementById('education_list');
      jsonData.EDUCATIONS.forEach(education => {
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
      /////////////////////////////////////////////////////////

      // HARDSKILL SECTION
      const hardSkillElement = document.getElementById('hardskill_list');
      jsonData.HARDSKILLS.forEach(hardSkill => {
        hardSkillElement.innerHTML += `
         <div>
          <img src="${hardSkill.IMAGE}">
          <p>${hardSkill.TITLE}</p>
        </div>
        `;
      });
      /////////////////////////////////////////////////////////

      // OTHER SKILL SECTION
      const otherElement = document.getElementById('other_list');
      jsonData.OTHERSKILLS.forEach(otherSkill => {
        otherElement.innerHTML += `
         <div>
          <img src="${otherSkill.IMAGE}">
          <p>${otherSkill.TITLE}</p>
        </div>
        `;
      });
      /////////////////////////////////////////////////////////

      // SOFTSKILL SECTION
      const softSkillElement = document.getElementById('softskill_list');
      jsonData.SOFTSKILLS.forEach(softSkill => {
        softSkillElement.innerHTML += `
        <div>
          <button>${softSkill.TITLE}</button>
        </div>
        `;
      });
      /////////////////////////////////////////////////////////

      // PROJECT SECTION
      const projectElement = document.getElementById('project_list');
      jsonData.PROJECTS.forEach(project => {
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
        ${project.SKILLS.map(skill => {
          return `<button class="skills">${skill}</button>`;
        }).join('')}
        </div>

      </div>
        `;
      });
      /////////////////////////////////////////////////////////

      // CONTACT SECTION
      const contactElement = document.getElementById('contact_list');
      jsonData.CONTACTS.forEach(contact => {
        if (contact.TITLE === 'Gmail') {
          contactElement.innerHTML += `
          <div data-swal-toast-template="#send-email" onclick="triggerSwal('${contact.LINK}')">
            <img src="${contact.IMAGE}">
            <p>${contact.TITLE}</p>
          </div>
          `;
        } else {
          contactElement.innerHTML += `
          <div onclick="openLink('${contact.LINK}')">
            <img src="${contact.IMAGE}">
            <p>${contact.TITLE}</p>
          </div>
          `;
        }
      });

      // DESCRIPTION 
      const contactDescription = document.getElementById('contact_description');
      contactDescription.textContent = jsonData.CONTACT_DESCRIPTION;
      /////////////////////////////////////////////////////////

  } catch (error) {
      console.error("Gagal memuat data JSON:", error);
  }
}

// Memanggil fungsi loadData setelah halaman dimuat
loadData();

function openLink(url) {
  window.open('https://' + url, '_blank');
};

function scrollElement(element) {
  event.preventDefault();
  document.querySelector(`#${element}`).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
};

function triggerSwal(text) {
  Swal.bindClickHandler();
  Swal.mixin({
    toast: true,
    html: `<h3>Email: </h3><p>${text}</p>`
  }).bindClickHandler("data-swal-toast-template");
};

// Show the button when the user scrolls past the "home" section
window.onscroll = function() {
  let homeSection = document.getElementById("home");
  let backToTopButton = document.getElementById("back-to-top");
  
  if (window.pageYOffset > homeSection.offsetHeight) {
      backToTopButton.style.display = "block";
  } else {
      backToTopButton.style.display = "none";
  }
};

// Scroll to the top of the page when the button is clicked
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// download pdf
document.getElementById('download-btn').addEventListener('click', function () {
  fetch('/assets/docs/Bagas Arisandi - Backend Developer.pdf')
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Bagas Arisandi - Backend Developer.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Error downloading the file:', error));
});
