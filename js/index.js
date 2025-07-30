// Memanggil fungsi loadData setelah halaman dimuat
loadData();

document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('show-menu');
  document.querySelector('.hamburger').classList.toggle('active');
});
