// Memanggil fungsi loadData setelah halaman dimuat
loadData();

// download pdf
document.getElementById("download-btn").addEventListener("click", function () {
  // fetch("/assets/docs/Bagas Arisandi - Backend Developer.pdf")
  fetch(jsonData.HOME.RESUME)
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

document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('show-menu');
  document.querySelector('.hamburger').classList.toggle('active');
});
