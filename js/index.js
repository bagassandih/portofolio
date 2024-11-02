// Memanggil fungsi loadData setelah halaman dimuat
loadData();

// Show the button when the user scrolls past the "home" section
window.onscroll = function () {
  let homeSection = document.getElementById("home");
  let backToTopButton = document.getElementById("back-to-top");

  if (window.pageYOffset > homeSection.offsetHeight) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};

// download pdf
document.getElementById("download-btn").addEventListener("click", function () {
  fetch("/assets/docs/Bagas Arisandi - Backend Developer.pdf")
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "Bagas Arisandi - Backend Developer.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error downloading the file:", error));
});
