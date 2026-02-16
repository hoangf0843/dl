const setBg = () => {
  const activeSlide = document.querySelector(".swiper-slide-active > img");
  const background = document.getElementById("slide-bg");
  const photo = document.getElementById("slide-photo");
  
  if (!activeSlide || !background || !photo) return;
  
  const src = activeSlide.getAttribute("src");

  // Bắt đầu hiệu ứng chuyển tiếp
  background.classList.add("slide-changing");
  photo.classList.add("slide-changing");

  setTimeout(() => {
    background.style.backgroundImage = `url(${src})`;
    photo.style.backgroundImage = `url(${src})`;
    
    // Kết thúc hiệu ứng chuyển tiếp
    background.classList.remove("slide-changing");
    photo.classList.remove("slide-changing");
  }, 300); // 300ms là thời điểm giữa của transition 600ms
};
document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".swiper", {
    // effect: "cards",
    loop: true,
    spaceBetween: 10,
    slidesPerView: 3,
    watchSlidesProgress: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });
  setBg();
  swiper.on("slideChange", setBg);

  // Lấy tất cả các bong bóp
  const bubbles = document.querySelectorAll(".bubble");

  bubbles.forEach((bubble, index) => {
    // Vị trí ngang ngẫu nhiên (0-100%)
    const randomLeft = randomBetween(0, 100);

    // Thời gian bay lên ngẫu nhiên (5-10 giây)
    const randomDuration = randomBetween(5, 10);

    // Độ trễ ngẫu nhiên (0-2 giây)
    const randomDelay = randomBetween(0, 2);

    // Chuyển động ngang ngẫu nhiên (-150 đến 150px)
    const randomTranslate = randomBetween(-150, 150);

    // Áp dụng CSS variables
    bubble.style.setProperty("--duration", randomDuration.toFixed(2) + "s");
    bubble.style.setProperty("--delay", randomDelay.toFixed(2) + "s");
    bubble.style.setProperty("--tx", randomTranslate.toFixed(0) + "px");
    bubble.style.left = randomLeft.toFixed(2) + "%";
    bubble.style.bottom = "-200px";
  });
  // Canvas particles (Floating Hearts)
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener("resize", resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 15 + 5;
      this.speed = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.type = Math.random() > 0.5 ? 'heart' : 'bokeh';
      this.color = `rgba(255, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 150)}, ${this.opacity})`;
    }
    update() {
      this.y -= this.speed;
      this.x += Math.sin(this.y / 50) * 0.5;
      if (this.y < -20) this.reset();
    }
    draw() {
      ctx.fillStyle = this.color;
      if (this.type === 'heart') {
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(this.x, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + (this.size + topCurveHeight) / 2, this.x, this.y + this.size);
        ctx.bezierCurveTo(this.x, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, this.x + this.size / 2, this.y + topCurveHeight);
        ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < 40; i++) {
    particles.push(new Particle());
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  };
  animate();

  // Scroll Reveal Observer
  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        // Tùy chọn: dừng quan sát sau khi đã hiển thị
        // observer.unobserve(entry.target);
      } else {
        // Tùy chọn: ẩn lại khi cuộn đi (nếu muốn hiệu ứng lặp lại)
        entry.target.classList.remove("show");
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.1, // Kích hoạt khi 10% phần tử xuất hiện
  });

  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach((el) => revealObserver.observe(el));
});

// Hàm tạo số ngẫu nhiên trong khoảng
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
