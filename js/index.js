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
  fetch('/assets/Bagas Arisandi - Backend Developer.pdf')
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