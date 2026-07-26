// app.js — storefront logic (no backend; cart lives in memory for the session)

const state = {
  category: "all",
  search: "",
  sort: "default",
  priceBand: "all",
  cart: {} // sku -> { product, qty }
};

const grid = document.getElementById("product-grid");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
const heroItemCount = document.getElementById("hero-item-count");

const CATEGORY_ICONS = {
  "rc-cars": carIcon,
  "rc-drones": droneIcon,
  "diecast-cars": diecastCarIcon,
  "diecast-planes": planeIcon
};

/* ---------- Placeholder line-art icons (no external images needed) ---------- */
function carIcon() {
  return `<svg class="placeholder-art" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 58 L22 34 Q26 26 38 26 L82 26 Q94 26 98 34 L106 58" stroke="#14161B" stroke-width="3" stroke-linejoin="round"/>
    <rect x="10" y="56" width="100" height="18" rx="4" stroke="#14161B" stroke-width="3"/>
    <circle cx="32" cy="76" r="10" fill="#F5F3EE" stroke="#14161B" stroke-width="3"/>
    <circle cx="88" cy="76" r="10" fill="#F5F3EE" stroke="#14161B" stroke-width="3"/>
    <line x1="40" y1="30" x2="40" y2="56" stroke="#14161B" stroke-width="2.5"/>
    <line x1="72" y1="30" x2="72" y2="56" stroke="#14161B" stroke-width="2.5"/>
  </svg>`;
}
function droneIcon() {
  return `<svg class="placeholder-art" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="45" r="10" stroke="#14161B" stroke-width="3"/>
    <line x1="60" y1="45" x2="24" y2="22" stroke="#14161B" stroke-width="3"/>
    <line x1="60" y1="45" x2="96" y2="22" stroke="#14161B" stroke-width="3"/>
    <line x1="60" y1="45" x2="24" y2="68" stroke="#14161B" stroke-width="3"/>
    <line x1="60" y1="45" x2="96" y2="68" stroke="#14161B" stroke-width="3"/>
    <circle cx="24" cy="22" r="12" stroke="#14161B" stroke-width="2.5"/>
    <circle cx="96" cy="22" r="12" stroke="#14161B" stroke-width="2.5"/>
    <circle cx="24" cy="68" r="12" stroke="#14161B" stroke-width="2.5"/>
    <circle cx="96" cy="68" r="12" stroke="#14161B" stroke-width="2.5"/>
  </svg>`;
}
function diecastCarIcon() {
  return `<svg class="placeholder-art" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 52 L26 32 Q30 24 42 24 L78 24 Q88 24 92 32 L100 52 Z" fill="#F5F3EE" stroke="#14161B" stroke-width="3" stroke-linejoin="round"/>
    <rect x="14" y="50" width="92" height="16" rx="5" fill="#F5F3EE" stroke="#14161B" stroke-width="3"/>
    <circle cx="34" cy="68" r="9" fill="#14161B"/>
    <circle cx="86" cy="68" r="9" fill="#14161B"/>
    <circle cx="34" cy="68" r="3" fill="#F5F3EE"/>
    <circle cx="86" cy="68" r="3" fill="#F5F3EE"/>
  </svg>`;
}
function planeIcon() {
  return `<svg class="placeholder-art" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="14" y1="45" x2="106" y2="45" stroke="#14161B" stroke-width="3"/>
    <path d="M52 45 L96 45 L106 38 M96 45 L106 52" stroke="#14161B" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M60 45 L38 20 M60 45 L38 70" stroke="#14161B" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 45 L26 34 M40 45 L26 56" stroke="#14161B" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

/* ---------- Rendering ---------- */
function getFiltered() {
  let items = PRODUCTS.filter(p => {
    if (state.category !== "all" && p.category !== state.category) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const hay = `${p.name} ${p.scale} ${p.sku} ${p.categoryLabel}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (state.priceBand !== "all") {
      const price = p.price;
      if (state.priceBand === "under25" && !(price < 25)) return false;
      if (state.priceBand === "25to75" && !(price >= 25 && price <= 75)) return false;
      if (state.priceBand === "75to200" && !(price > 75 && price <= 200)) return false;
      if (state.priceBand === "over200" && !(price > 200)) return false;
    }
    return true;
  });

  if (state.sort === "price-asc") items.sort((a, b) => a.price - b.price);
  else if (state.sort === "price-desc") items.sort((a, b) => b.price - a.price);
  else if (state.sort === "name-asc") items.sort((a, b) => a.name.localeCompare(b.name));

  return items;
}

function stockLabel(stock) {
  if (stock === "in-stock") return { text: "IN STOCK", cls: "stock-in" };
  if (stock === "low-stock") return { text: "LOW STOCK", cls: "stock-low" };
  return { text: "OUT OF STOCK", cls: "stock-out" };
}

function renderGrid() {
  const items = getFiltered();
  resultsCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;
  emptyState.hidden = items.length !== 0;
  grid.innerHTML = items.map(cardHtml).join("");

  grid.querySelectorAll("[data-view-sku]").forEach(el => {
    el.addEventListener("click", () => openModal(el.getAttribute("data-view-sku")));
  });
  grid.querySelectorAll("[data-add-sku]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(el.getAttribute("data-add-sku"));
    });
  });
}

function mediaHtml(p) {
  const iconFn = CATEGORY_ICONS[p.category] || carIcon;
  if (p.image) {
    // If the real photo 404s (e.g. assets/ is still empty), swap in the line-art
    // icon instead of showing a broken-image glyph.
    return `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'), {innerHTML: \`${iconFn().replace(/`/g, "\\`")}\`}).firstElementChild)">`;
  }
  return iconFn();
}

function cardHtml(p) {
  const stock = stockLabel(p.stock);
  const disabled = p.stock === "out-of-stock";
  return `
    <article class="product-card">
      <div class="card-media" data-view-sku="${p.sku}" style="cursor:pointer">
        ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ""}
        ${mediaHtml(p)}
      </div>
      <div class="card-body" data-view-sku="${p.sku}" style="cursor:pointer">
        <span class="card-cat">${p.categoryLabel.toUpperCase()}</span>
        <h3 class="card-name">${p.name}</h3>
        <span class="card-scale">Scale ${p.scale} &middot; SKU ${p.sku}</span>
        <div class="card-bottom">
          <span class="price-sticker">$${p.price.toFixed(2)}</span>
          <span class="stock-pill ${stock.cls}">${stock.text}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-secondary" data-view-sku="${p.sku}">Details</button>
        <button class="btn btn-add" data-add-sku="${p.sku}" ${disabled ? "disabled" : ""}>${disabled ? "Sold Out" : "Add to Cart"}</button>
      </div>
    </article>
  `;
}

/* ---------- Cart ---------- */
function addToCart(sku) {
  const product = PRODUCTS.find(p => p.sku === sku);
  if (!product || product.stock === "out-of-stock") return;
  if (!state.cart[sku]) state.cart[sku] = { product, qty: 0 };
  state.cart[sku].qty += 1;
  renderCart();
  showToast(`Added ${product.name} to cart`);
}

function changeQty(sku, delta) {
  const line = state.cart[sku];
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) delete state.cart[sku];
  renderCart();
}

function removeFromCart(sku) {
  delete state.cart[sku];
  renderCart();
}

function cartCount() {
  return Object.values(state.cart).reduce((sum, l) => sum + l.qty, 0);
}
function cartTotal() {
  return Object.values(state.cart).reduce((sum, l) => sum + l.qty * l.product.price, 0);
}

function renderCart() {
  const items = Object.values(state.cart);
  document.getElementById("cart-count").textContent = cartCount();
  document.getElementById("cart-total").textContent = `$${cartTotal().toFixed(2)}`;
  const checkoutBtn = document.getElementById("checkout-btn");
  checkoutBtn.disabled = items.length === 0;

  const container = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("cart-empty");

  if (items.length === 0) {
    container.innerHTML = "";
    container.appendChild(emptyMsg);
    return;
  }

  container.innerHTML = items.map(line => {
    const p = line.product;
    return `
      <div class="cart-line">
        <div class="cart-line-thumb">${mediaHtml(p)}</div>
        <div class="cart-line-body">
          <p class="cart-line-name">${p.name}</p>
          <span class="cart-line-meta">$${p.price.toFixed(2)} each</span>
          <div class="cart-line-row">
            <div class="qty-control">
              <button data-qty-minus="${p.sku}" aria-label="Decrease quantity">−</button>
              <span>${line.qty}</span>
              <button data-qty-plus="${p.sku}" aria-label="Increase quantity">+</button>
            </div>
            <span class="cart-line-price">$${(p.price * line.qty).toFixed(2)}</span>
          </div>
          <button class="cart-line-remove" data-remove="${p.sku}">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll("[data-qty-plus]").forEach(el =>
    el.addEventListener("click", () => changeQty(el.getAttribute("data-qty-plus"), 1)));
  container.querySelectorAll("[data-qty-minus]").forEach(el =>
    el.addEventListener("click", () => changeQty(el.getAttribute("data-qty-minus"), -1)));
  container.querySelectorAll("[data-remove]").forEach(el =>
    el.addEventListener("click", () => removeFromCart(el.getAttribute("data-remove"))));
}

/* ---------- Cart panel open/close ---------- */
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  document.getElementById("cart-close").focus();
}
function closeCart() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
}
document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/* ---------- Checkout (mailto — no backend/payment) ---------- */
document.getElementById("checkout-btn").addEventListener("click", () => {
  const items = Object.values(state.cart);
  if (items.length === 0) return;
  const lines = items.map(l => `${l.qty} x ${l.product.name} (${l.product.sku}) — $${(l.qty * l.product.price).toFixed(2)}`);
  const body = encodeURIComponent(
    `Order request from Throttle & Chrome site:\n\n${lines.join("\n")}\n\nSubtotal: $${cartTotal().toFixed(2)}\n\n(Reply to confirm availability and shipping/pickup.)`
  );
  window.location.href = `mailto:orders@example.com?subject=${encodeURIComponent("New order — Throttle & Chrome")}&body=${body}`;
});

/* ---------- Product modal ---------- */
const modal = document.getElementById("product-modal");
const modalOverlay = document.getElementById("modal-overlay");
const modalContent = document.getElementById("modal-content");

function openModal(sku) {
  const p = PRODUCTS.find(x => x.sku === sku);
  if (!p) return;
  const stock = stockLabel(p.stock);
  const disabled = p.stock === "out-of-stock";
  modalContent.innerHTML = `
    <div class="modal-media">${mediaHtml(p)}</div>
    <div class="modal-info">
      <span class="modal-cat">${p.categoryLabel.toUpperCase()}</span>
      <h2 class="modal-title" id="modal-title">${p.name}</h2>
      <p class="modal-scale">Scale ${p.scale}</p>
      <p class="modal-price">$${p.price.toFixed(2)} <span class="stock-pill ${stock.cls}">${stock.text}</span></p>
      <p class="modal-desc">${p.description}</p>
      <ul class="modal-specs">${p.specs.map(s => `<li>${s}</li>`).join("")}</ul>
      <button class="btn btn-primary btn-block" data-modal-add="${p.sku}" ${disabled ? "disabled" : ""}>${disabled ? "Sold Out" : "Add to Cart"}</button>
      <p class="modal-sku">SKU: ${p.sku}</p>
    </div>
  `;
  modal.querySelector("[data-modal-add]")?.addEventListener("click", () => {
    addToCart(p.sku);
  });
  modal.classList.add("open");
  modalOverlay.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.getElementById("modal-close").focus();
}
function closeModal() {
  modal.classList.remove("open");
  modalOverlay.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
document.getElementById("modal-close").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeModal(); closeCart(); }
});

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Filter controls ---------- */
document.querySelectorAll(".nav-link").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.category = btn.getAttribute("data-category");
    renderGrid();
  });
});

document.getElementById("search-input").addEventListener("input", (e) => {
  state.search = e.target.value.trim();
  renderGrid();
});
document.getElementById("sort-select").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderGrid();
});
document.getElementById("price-select").addEventListener("change", (e) => {
  state.priceBand = e.target.value;
  renderGrid();
});

/* ---------- Init ---------- */
heroItemCount.textContent = PRODUCTS.length;
renderGrid();
renderCart();
