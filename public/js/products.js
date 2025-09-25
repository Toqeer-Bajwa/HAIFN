// Dummy products (later: fetch from API)
const products = [
  {
    id: 1,
    name: "LED Bulb",
    description: "Energy efficient LED bulb for home & office.",
    option: "18W",
    category: "LED Bulb",
    image: "https://via.placeholder.com/300x200?text=LED+Bulb"
  },
  {
    id: 2,
    name: "SMD Downlight",
    description: "Slim recessed downlight for modern ceilings.",
    option: "12W",
    category: "SMD Downlight",
    image: "https://via.placeholder.com/300x200?text=SMD+Downlight"
  },
  {
    id: 3,
    name: "Rope Light",
    description: "Flexible rope lights in multiple colors.",
    option: "Warm White",
    category: "Rope Light",
    image: "https://via.placeholder.com/300x200?text=Rope+Light"
  },
  {
    id: 4,
    name: "Flood Light",
    description: "High power flood light for outdoors.",
    option: "100W",
    category: "Flood Lights",
    image: "https://via.placeholder.com/300x200?text=Flood+Light"
  }
];

const productList = document.getElementById("productList");
const categoryFilter = document.getElementById("categoryFilter");

// Render products
function renderProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="desc">${product.description}</p>
      <p class="option"><strong>${product.option}</strong></p>
    `;

    productList.appendChild(card);
  });
}

// Initial render
renderProducts(products);

// Filter products by category
categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;

  if (selected === "all") {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === selected);
    renderProducts(filtered);
  }
});
