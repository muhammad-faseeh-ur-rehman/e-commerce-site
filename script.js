const products = [
  {
    id: 1,
    name: "Form No. 01",
    category: "Objects",
    price: 48,
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=700&q=85",
    description:
      "A hand-shaped stoneware vessel with a soft, architectural silhouette. Made for stems, brushes, or simply its own quiet presence.",
  },
  {
    id: 2,
    name: "Daily Trouser",
    category: "Apparel",
    price: 118,
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Relaxed, easy trousers in washed cotton twill. A generous cut designed to move through the whole day.",
  },
  {
    id: 3,
    name: "Soft Throw",
    category: "Home",
    price: 86,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85",
    description:
      "A generously sized cotton throw with a dry, tactile weave. The one that lives on the back of the sofa.",
  },
  {
    id: 4,
    name: "Arc Candle",
    category: "Home",
    price: 34,
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85",
    description:
      "A sculptural soy candle with notes of cedar, bergamot, and something faintly smoky.",
  },
  {
    id: 5,
    name: "Studio Shirt",
    category: "Apparel",
    price: 92,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=85",
    description:
      "A roomy everyday shirt in crisp, airy poplin. Wear it open, tucked in, or however the day asks.",
  },
  {
    id: 6,
    name: "Cloud Glasses",
    category: "Objects",
    price: 42,
    tag: "Set of 2",
    image:
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=700&q=85",
    description:
      "Two hand-blown drinking glasses with a subtle, imperfect ripple around the rim.",
  },
  {
    id: 7,
    name: "Field Cap",
    category: "Apparel",
    price: 45,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85",
    description:
      "A six-panel cap in washed canvas, with an adjustable brass clasp at the back.",
  },
  {
    id: 8,
    name: "Small Tray",
    category: "Objects",
    price: 38,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=85",
    description:
      "A low, useful tray in warm acacia wood. For keys, rings, or the things that collect by the door.",
  },
];

let cart = JSON.parse(localStorage.getItem("nova-cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("nova-wishlist") || "[]");
let activeCategory = "All";
let searchTerm = "";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (amount) => `$${amount.toFixed(2)}`;

function saveState() {
  localStorage.setItem("nova-cart", JSON.stringify(cart));
  localStorage.setItem("nova-wishlist", JSON.stringify(wishlist));
}

function renderProducts() {
  const sort = $("#sort-select").value;
  let visible = products.filter(
    (product) =>
      activeCategory === "All" || product.category === activeCategory,
  );
  if (searchTerm)
    visible = visible.filter((product) =>
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(searchTerm),
    );
  if (sort === "low") visible.sort((a, b) => a.price - b.price);
  if (sort === "high") visible.sort((a, b) => b.price - a.price);
  if (sort === "newest")
    visible.sort(
      (a, b) =>
        Number(Boolean(b.tag === "New")) - Number(Boolean(a.tag === "New")),
    );
  $("#product-grid").innerHTML = visible.map(productCard).join("");
  $("#empty-state").hidden = visible.length > 0;
}

function productCard(product) {
  const isWished = wishlist.includes(product.id);
  return `<article class="product-card" data-product-id="${product.id}">
    <div class="product-image-wrap"><img src="${product.image}" alt="${product.name}" loading="lazy">${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}<button class="wish-button ${isWished ? "active" : ""}" type="button" data-wishlist="${product.id}" aria-label="${isWished ? "Remove from" : "Add to"} wishlist">${isWished ? "♥" : "♡"}</button><button class="quick-add" type="button" data-add="${product.id}">Add to bag <span>+</span></button></div>
    <div class="product-info"><div><p class="product-name">${product.name}</p><p class="product-meta">${product.category}</p></div><p class="product-price">${money(product.price)}</p></div>
  </article>`;
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  $$(".cart-count, .drawer-count").forEach(
    (element) => (element.textContent = totalItems),
  );
  $(".wishlist-count").textContent = wishlist.length;
  $("#cart-subtotal").textContent = money(subtotal);
  $("#cart-items").innerHTML = cart
    .map(
      (item) =>
        `<div class="cart-item"><img src="${item.image}" alt="${item.name}"><div><p class="cart-item-name">${item.name}</p><p class="cart-item-meta">${item.category}</p><div class="qty-control"><button type="button" data-quantity="${item.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-quantity="${item.id}" data-change="1" aria-label="Increase quantity">+</button></div><button class="remove-item" type="button" data-remove="${item.id}">Remove</button></div><span class="cart-item-price">${money(item.price * item.quantity)}</span></div>`,
    )
    .join("");
  $("#cart-drawer").classList.toggle("is-empty", cart.length === 0);
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveState();
  renderCart();
  showToast(`${product.name} added to your bag`);
}

function changeQuantity(id, change) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== id);
  saveState();
  renderCart();
}

function toggleWishlist(id) {
  wishlist = wishlist.includes(id)
    ? wishlist.filter((item) => item !== id)
    : [...wishlist, id];
  saveState();
  renderProducts();
  renderCart();
  showToast(
    wishlist.includes(id) ? "Saved to your wishlist" : "Removed from wishlist",
  );
}

function openCart() {
  $("#cart-drawer").classList.add("open");
  $("#cart-drawer").setAttribute("aria-hidden", "false");
  $("#overlay").classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  $("#cart-drawer").classList.remove("open");
  $("#cart-drawer").setAttribute("aria-hidden", "true");
  $("#overlay").classList.remove("show");
  document.body.style.overflow = "";
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function openQuickView(id) {
  const product = products.find((item) => item.id === id);
  $("#quick-view-content").innerHTML =
    `<img src="${product.image}" alt="${product.name}"><div class="quick-view-copy"><p class="eyebrow">${product.category} / ${product.tag || "NOVA Objects"}</p><h2>${product.name}</h2><span class="product-price">${money(product.price)}</span><p>${product.description}</p><button class="primary-button" type="button" data-modal-add="${product.id}">Add to bag <span>↗</span></button></div>`;
  $("#quick-view").classList.add("open");
  $("#quick-view").setAttribute("aria-hidden", "false");
  $("#overlay").classList.add("show");
}
function closeModal() {
  $("#quick-view").classList.remove("open");
  $("#quick-view").setAttribute("aria-hidden", "true");
  $("#overlay").classList.remove("show");
}

$("#product-grid").addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const wishButton = event.target.closest("[data-wishlist]");
  if (addButton) {
    event.stopPropagation();
    addToCart(Number(addButton.dataset.add));
    return;
  }
  if (wishButton) {
    event.stopPropagation();
    toggleWishlist(Number(wishButton.dataset.wishlist));
    return;
  }
  const card = event.target.closest("[data-product-id]");
  if (card) openQuickView(Number(card.dataset.productId));
});
$("#cart-items").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton)
    changeQuantity(
      Number(quantityButton.dataset.quantity),
      Number(quantityButton.dataset.change),
    );
  if (removeButton) {
    cart = cart.filter(
      (item) => item.id !== Number(removeButton.dataset.remove),
    );
    saveState();
    renderCart();
  }
});

$$(".filter-button").forEach((button) =>
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    $$(".filter-button").forEach((item) =>
      item.classList.toggle("active", item === button),
    );
    renderProducts();
  }),
);
$$("[data-nav-category]").forEach((link) =>
  link.addEventListener("click", () => {
    activeCategory = link.dataset.navCategory;
    $$(".filter-button").forEach((item) =>
      item.classList.toggle("active", item.dataset.category === activeCategory),
    );
    renderProducts();
  }),
);
$("#sort-select").addEventListener("change", renderProducts);
$(".search-toggle").addEventListener("click", () => {
  $("#search-form").classList.toggle("open");
  if ($("#search-form").classList.contains("open")) $("#search-input").focus();
});
$("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = $("#search-input").value.trim().toLowerCase();
  renderProducts();
  $("#shop").scrollIntoView({ behavior: "smooth" });
});
$(".menu-toggle").addEventListener("click", () =>
  $(".main-nav").classList.toggle("open"),
);
$$("[data-open-cart]").forEach((button) =>
  button.addEventListener("click", openCart),
);
$$("[data-close-cart]").forEach((button) =>
  button.addEventListener("click", closeCart),
);
$("#overlay").addEventListener("click", () => {
  closeCart();
  closeModal();
});
$$("[data-close-modal]").forEach((button) =>
  button.addEventListener("click", closeModal),
);
$("#quick-view").addEventListener("click", (event) => {
  const button = event.target.closest("[data-modal-add]");
  if (button) {
    addToCart(Number(button.dataset.modalAdd));
    closeModal();
    openCart();
  }
});
$("#checkout-button").addEventListener("click", () => {
  if (!cart.length) return;
  cart = [];
  saveState();
  renderCart();
  closeCart();
  showToast("Order placed. Thank you for shopping NOVA.");
});
$("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.target.reset();
  showToast("You are on the list.");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeModal();
  }
});

renderProducts();
renderCart();
