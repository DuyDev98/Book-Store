let index = 0;
const slides = document.querySelectorAll('.banner-slide img');
const total = slides.length;
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

function showSlide(i) {
  slides.forEach((slide, idx) => {
    slide.classList.remove('active');
    if (idx === i) slide.classList.add('active');
  });
}

function nextSlide() {
  index = (index + 1) % total;
  showSlide(index);
}

function prevSlide() {
  index = (index - 1 + total) % total;
  showSlide(index);
}

next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);
setInterval(nextSlide, 4000); // Tự động chuyển mỗi 4 giây
