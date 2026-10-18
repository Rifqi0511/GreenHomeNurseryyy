
const products = [
  {
    id: 1,
    name: "Monstera",
    category: "Tanaman hias",
    desc: "Tanaman hias dengan daun unik.",
    price: 65000,
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Lidah Mertua",
    category: "Tanaman hias",
    desc: "Tanaman hias yang mudah dirawat.",
    price: 35000,
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae2b9a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Sirih Gading",
    category: "Tanaman hias",
    desc: "Tanaman hijau untuk mempercantik rumah.",
    price: 25000,
    image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Bibit Cabai",
    category: "Bibit",
    desc: "Bibit untuk kebun rumahan.",
    price: 8000,
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Bibit Tomat",
    category: "Bibit",
    desc: "Mulai menanam sayuran sendiri.",
    price: 7000,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Pot Minimalis",
    category: "Pot",
    desc: "Pot untuk tanaman kesayanganmu.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Media Tanam",
    category: "Perawatan",
    desc: "Media untuk mendukung pertumbuhan tanaman.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Pupuk Organik",
    category: "Perawatan",
    desc: "Perlengkapan perawatan tanaman.",
    price: 12000,
    image: "https://images.unsplash.com/photo-1599685315640-7ec1d8a1f1b0?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = {};
let currentFilter = "Semua";

function rupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function renderProducts() {
  const container = document.getElementById("products");

  const filtered = products.filter(product =>
    currentFilter === "Semua" ||
    product.category === currentFilter
  );

  container.innerHTML = filtered.map(product => `
    <article class="product">
      <img
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.alt='Foto tidak tersedia'; this.style.display='none'">

      <div class="product-info">
        <span class="tag">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-desc">${product.desc}</p>

        <div class="price-row">
          <span class="price">${rupiah(product.price)}</span>
          <button class="add"
            onclick="addToCart(${product.id})">+</button>
        </div>
      </div>
    </article>
  `).join("");
}

function filterProducts(category, button) {
  currentFilter = category;

  document.querySelectorAll(".filter").forEach(item => {
    item.classList.remove("active");
  });

  button.classList.add("active");
  renderProducts();
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
}

function changeQty(id, amount) {
  cart[id] = (cart[id] || 0) + amount;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  updateCart();
}

function updateCart() {
  const count = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity, 0
  );

  document.getElementById("cart-count").textContent = count;
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const entries = Object.entries(cart);

  if (entries.length === 0) {
    container.innerHTML =
      '<p class="empty">Keranjang masih kosong 🌱</p>';

    document.getElementById("cart-total").textContent = rupiah(0);
    return;
  }

  container.innerHTML = entries.map(([id, quantity]) => {
    const product = products.find(p => p.id === Number(id));

    return `
      <div class="cart-item">
        <div>
          <strong>${product.name}</strong>
          <br>${rupiah(product.price)} × ${quantity}
        </div>
        <div class="qty">
          <button onclick="changeQty(${id}, -1)">−</button>
          ${quantity}
          <button onclick="changeQty(${id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("");

  const total = entries.reduce((sum, [id, quantity]) => {
    const product = products.find(p => p.id === Number(id));
    return sum + product.price * quantity;
  }, 0);

  document.getElementById("cart-total").textContent = rupiah(total);
}

function toggleCart(show) {
  document.getElementById("cart-panel")
    .classList.toggle("open", show);
}

function goCheckout() {
  if (Object.keys(cart).length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  toggleCart(false);
  document.getElementById("pesan").scrollIntoView({
    behavior: "smooth"
  });
}

document.getElementById("checkout-form")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    if (Object.keys(cart).length === 0) {
      alert("Pilih produk terlebih dahulu!");
      return;
    }

    const name = document.getElementById("customer-name").value;
    const phone = document.getElementById("customer-phone").value;
    const address = document.getElementById("customer-address").value;
    const delivery = document.getElementById("delivery").value;

    const details = Object.entries(cart).map(([id, quantity]) => {
      const p = products.find(item => item.id === Number(id));
      return `${p.name} x${quantity} = ${rupiah(p.price * quantity)}`;
    });

    const total = Object.entries(cart).reduce((sum, [id, quantity]) => {
      const p = products.find(item => item.id === Number(id));
      return sum + p.price * quantity;
    }, 0);

    const message = [
      "Halo GreenHome Nursery, saya ingin memesan:",
      "",
      ...details,
      "",
      `Total: ${rupiah(total)}`,
      `Nama: ${name}`,
      `WhatsApp: ${phone}`,
      `Alamat: ${address}`,
      `Pengiriman: ${delivery}`
    ].join("\n");

    // Ganti dengan nomor WhatsApp penjual.
    const WHATSAPP_NUMBER = "6281234567890";

    if (WHATSAPP_NUMBER === "6281234567890") {
      alert("Ganti nomor WhatsApp penjual di script.js terlebih dahulu.");
      return;
    }

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });

document.getElementById("year").textContent =
  new Date().getFullYear();

renderProducts();
updateCart();
