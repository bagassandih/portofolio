// open link function
function openLink(url) {
  window.open("https://" + url, "_blank");
}

// Scroll to a specific element
function scrollElement(element) {
  event.preventDefault();
  document
    .querySelector(`#${element}`)
    .scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

// Trigger the Swal toast
function triggerSwal(text) {
  Swal.bindClickHandler();
  Swal.mixin({
    toast: true,
    html: `<h3>Email: </h3><p>${text}</p>`,
  }).bindClickHandler("data-swal-toast-template");
}

// Scroll to the top of the page when the button is clicked
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  