const navLinks = document.querySelectorAll(".navlink");

let userBalance = 10000;
let products = [];


if (localStorage.getItem("smartshop_balance")) {
  userBalance = Number(localStorage.getItem("smartshop_balance"));
}
function saveBalance() {
  localStorage.setItem("smartshop_balance", userBalance);
}
 
let cart = JSON.parse(localStorage.getItem("smartshop_cart")) || [];

function saveCart() {
  localStorage.setItem("smartshop_cart", JSON.stringify(cart));
}

// Active navbar link
function toggleStyle(id) {
  navLinks.forEach((link) => {
    link.classList.remove("font-bold", "border-b-2");
    link.classList.add("font-medium");

    if (link.dataset.id === id) {
      link.classList.remove("font-medium");
      link.classList.add("font-bold", "border-b-2");
    }
  });
}

// Update balance display
const updateBalanceDisplay = () => {
  const balanceTxt = "৳ " + userBalance;

  document.getElementById("desktop-navbar-current-balance").textContent =
    balanceTxt;

  document.getElementById("mobile-navbar-current-balance").textContent =
    balanceTxt;

  document.getElementById("modal-current-balance").textContent = balanceTxt;
};

updateBalanceDisplay();

// Add money buttons
const addMoneyModal = document.querySelectorAll(".add-money-modal");

addMoneyModal.forEach((button) => {
  button.addEventListener("click", () => {
    displayModal();
  });
});

// Display modal
const displayModal = () => {
  document.getElementById("add-money-modal").showModal();
};

// Confirm add-money
document.getElementById("confirm-topup-btn").addEventListener("click", () => {
  const amountInput = document.getElementById("topup-amount-input");
  const amount = Number(amountInput.value);

  userBalance += amount;

  saveBalance();
  updateBalanceDisplay();

  amountInput.value = "";

  document.getElementById("add-money-modal").close();
});

// Fetch products using async/await
async function fetchProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();

  // Convert USD to Bangladeshi Taka
  products = data.map((item) => ({
    ...item,
    priceBDT: Math.round(item.price * 120),
  }));

  console.log(products);

  displayProducts(products);
}

fetchProducts();

// Display products
const displayProducts = (products) => {
  const productGrid = document.getElementById("product-grid");

  productGrid.innerHTML = "";

  console.log("products", products);

  for (let item of products) {
    const { id, image, category, rating, title, priceBDT } = item;

    let card = document.createElement("div");

    card.className =
      "group relative flex flex-col bg-white border border-zinc-200 rounded-2xl p-4";

    card.innerHTML = `
      <div class="relative w-full h-48 bg-zinc-50 rounded-xl p-4 flex items-center justify-center mb-3">
        <img src="${image}" alt="Product" class="max-h-full max-w-full object-contain">

        <span class="absolute top-2 left-2 text-[9px] uppercase px-2 py-0.5 rounded bg-white border text-zinc-500">
          ${category}
        </span>
      </div>

      <div class="flex-1 flex flex-col">
        <p class="text-xs text-amber-500 mb-1">
          ⭐ ${rating ? rating.rate : 4.5}
        </p>

        <h3 class="text-xs font-medium line-clamp-2 mb-3">
          ${title}
        </h3>

        <div class="mt-auto pt-3 border-t flex justify-between items-center">
          <span class="text-sm font-semibold">৳ ${priceBDT}</span>

          <button onclick="addToCart(${id})"
            class="px-3 py-1 bg-zinc-900 text-white text-xs rounded-lg cursor-pointer">
            + Add
          </button>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  }
};

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

updateCartCount();


function addToCart(id) {
  const product = products.find((p) => p.id === id);

  if (product) {
    cart.push(product);

    saveCart();
    updateCartCount();

    console.log("Cart Data:", cart);
  }

  displayCartProduct(cart);
}

const displayCartProduct=(cart)=>{
    // write your code here
}


// Contact Form
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = contactForm.querySelector('[name="name"]').value.trim();
  const email = contactForm.querySelector('[name="email"]').value.trim();
  const message = contactForm.querySelector('[name="message"]').value.trim();

  if (name === "" || email === "" || message === "") {
    alert("Please fill in all fields!");
    return;
  }
  contactForm.reset();
  submitBtn.textContent = "Submitted";
});



