// --------------------
// Auth Check
// --------------------
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

// --------------------
// Sidebar Navigation
// --------------------
const sectionTitle = document.getElementById("section-title");
const sections = document.querySelectorAll(".admin-section");

document.querySelectorAll(".menu a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const section = link.getAttribute("data-section");

    // Active link styling
    document.querySelectorAll(".menu a").forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // Show/Hide sections
    sections.forEach(sec => sec.style.display = "none");
    const target = document.getElementById(`${section}-section`);
    if (target) target.style.display = "block";

    // Update header title
    sectionTitle.textContent = link.textContent;

    // Load data if needed
    if (section === "products") fetchProducts();
    if (section === "slider") loadSlides();
  });
});

// --------------------
// Product Management
// --------------------
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const categorySelect = document.getElementById("category");
const optionSelect = document.getElementById("option");

// Predefined category options
const categoryOptions = {
  "LED Bulb": ["5W", "13W", "18W", "30W", "40W", "50W"],
  "SMD Downlight": ["7W", "12W"],
  "Moon Light": ["12W", "18W", "24W", "36W"],
  "COB Light": ["5W"],
  "Batten Lights": ["20W", "40W", "60W"],
  "Flood Lights": ["30W", "50W", "100W"],
  "Panel Lights": ["6W", "12W", "18W"],
  "Rope Light": ["White", "Warm White", "Red", "Pink", "Green", "Blue", "Multi"]
};

// Update options when category changes
if (categorySelect) {
  categorySelect.addEventListener("change", () => {
    optionSelect.innerHTML = `<option value="">-- Select Option --</option>`;
    const options = categoryOptions[categorySelect.value] || [];
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      optionSelect.appendChild(option);
    });
  });
}

// Upload new product
if (productForm) {
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);

    // ✅ Normalize checkbox
    const featured = productForm.querySelector("[name='featured']").checked;
    formData.set("featured", featured);

    try {
      const res = await fetch("http://localhost:4000/api/admin/products", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Product added!");
        productForm.reset();
        fetchProducts();
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  });
}

// Fetch all products
async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:4000/api/products");
    const products = await res.json();

    productList.innerHTML = "";
    products.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("product-item");
      div.innerHTML = `
        <img src="http://localhost:4000/${p.image}" alt="${p.name}" width="60">
        <strong>${p.name}</strong> (${p.category?.name || p.category} - ${p.option}) <br>
        <small>${p.description}</small><br>
        <span>${p.featured ? "⭐ Featured" : ""}</span>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
      `;
      productList.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Fetch products error:", err);
  }
}

// Delete product
async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  try {
    const res = await fetch(`http://localhost:4000/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      alert("🗑 Product deleted");
      fetchProducts();
    } else {
      alert("❌ Failed to delete product");
    }
  } catch (err) {
    console.error("❌ Delete error:", err);
  }
}

// --------------------
// Slider Management
// --------------------
const sliderForm = document.getElementById("sliderForm");
const sliderList = document.getElementById("sliderList");

// Load existing slides
async function loadSlides() {
  try {
    const res = await fetch("http://localhost:4000/api/slider");
    const slides = await res.json();

    sliderList.innerHTML = "";
    slides.forEach(slide => {
      const div = document.createElement("div");
      div.classList.add("slider-item");
      div.innerHTML = `
        <img src="http://localhost:4000/${slide.image}" alt="${slide.title || "Slide"}" width="80">
        <p>${slide.title || "No Title"}</p>
        <button onclick="deleteSlide('${slide._id}')">Delete</button>
      `;
      sliderList.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Error loading slides:", err);
  }
}

// Upload new slide
if (sliderForm) {
  sliderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(sliderForm);

    try {
      const res = await fetch("http://localhost:4000/api/admin/slider", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Slide uploaded!");
        sliderForm.reset();
        loadSlides();
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  });
}

// Delete slide
async function deleteSlide(id) {
  if (!confirm("Delete this slide?")) return;
  try {
    const res = await fetch(`http://localhost:4000/api/admin/slider/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      alert("🗑 Slide deleted");
      loadSlides();
    } else {
      alert("❌ Failed to delete slide");
    }
  } catch (err) {
    console.error("❌ Delete error:", err);
  }
}

// --------------------
// Change Password
// --------------------
const passwordForm = document.getElementById("passwordForm");
if (passwordForm) {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(passwordForm);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Password updated successfully!");
        passwordForm.reset();
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("❌ Password update error:", err);
    }
  });
}

// --------------------
// Logout
// --------------------
const confirmLogout = document.getElementById("confirmLogout");
if (confirmLogout) {
  confirmLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}
