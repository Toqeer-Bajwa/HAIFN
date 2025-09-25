// Highlight active page link
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});
// =========================
// HOMEPAGE SLIDER
// =========================

let currentSlide = 0;
let slideData = [];

async function loadHomepageSlider() {
  try {
    const res = await fetch("http://localhost:4000/api/slider");
    slideData = await res.json();

    const wrapper = document.getElementById("sliderWrapper");
    wrapper.innerHTML = "";

    slideData.forEach(slide => {
      const div = document.createElement("div");
      div.classList.add("slider-item");

      div.innerHTML = `
        <a href="${slide.link || '#'}">
          <img src="${slide.image}" alt="${slide.title || 'Slide'}">
          <div class="slider-caption">${slide.title || ''}</div>
        </a>
      `;

      wrapper.appendChild(div);
    });

    showSlide(0);
  } catch (err) {
    console.error("❌ Error loading slider:", err);
  }
}

function showSlide(index) {
  const wrapper = document.getElementById("sliderWrapper");
  if (!slideData.length) return;

  if (index >= slideData.length) currentSlide = 0;
  else if (index < 0) currentSlide = slideData.length - 1;
  else currentSlide = index;

  const offset = -currentSlide * 100;
  wrapper.style.transform = `translateX(${offset}%)`;
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

// Auto-play every 5 seconds
setInterval(() => {
  if (slideData.length > 0) nextSlide();
}, 5000);

// Load slider on homepage load
if (document.getElementById("hero-slider")) {
  loadHomepageSlider();
}
// =========================
// FEATURED PRODUCTS
// =========================

async function loadFeaturedProducts() {
  try {
    const res = await fetch("http://localhost:4000/api/products/featured");
    const products = await res.json();

    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    // Show only first 8 products for homepage
    products.slice(0, 4).forEach(product => {
      const div = document.createElement("div");
      div.classList.add("product-card");

      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description || "No description available"}</p>
          <a href="product.html?id=${product._id}" class="product-btn">View</a>
        </div>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Error loading products:", err);
  }
}

// Load products on homepage
if (document.getElementById("featured-products")) {
  loadFeaturedProducts();
}
