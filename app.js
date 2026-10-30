const navLinks = document.querySelectorAll(".navlink");

let userBalance = 10000;
let products = [];

// Show toast notification (replaces alert)
function showToast(message, type) {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");

  // Pick alert class based on type
  let alertClass = "alert-success";
  if (type === "error") alertClass = "alert-error";
  if (type === "warning") alertClass = "alert-warning";
  if (type === "info") alertClass = "alert-info";

  toast.className =
    "alert " + alertClass + " text-sm shadow-lg pointer-events-auto";

  toast.innerHTML = "<span>" + message + "</span>";

  container.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

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
  document.getElementById("wallet-balance").textContent = balanceTxt;
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

  showToast("৳ " + amount + " added to your wallet!", "success");

  amountInput.value = "";

  document.getElementById("add-money-modal").close();
});

// Banner Function
const URL = "./Public/bannerCardData.json";

const fetchOfferBanner = async () => {
  console.log("Fetching Offer Banner Data...");
  let response = await fetch(URL);
  let data = await response.json();
  offerBannerCard(data);
};

fetchOfferBanner();

function offerBannerCard(data) {
  const Offer_Banners = document.getElementById("Offer_Banner");

  data.forEach((banner) => {
    const Banner = document.createElement("div");

    Banner.classList.add("banner-card");

    Banner.innerHTML = `
      <div class="banner-content relative w-full h-full">

        <!-- Image -->
        <img
          src="${banner.image}"
          alt="${banner.title}"
          class="banner-image w-full h-full object-cover"
        >

        <!-- Dark Shade -->
        <div class="absolute inset-0 bg-black/60"></div>

        <!-- Text Content -->
        <div class="absolute inset-0 z-10 max-w-7xl mx-auto flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white">
          <div class="offer-Text max-w-xl lg:max-w-2xl"> 
            <div class="banner-status flex items-center gap-2 mb-2 sm:mb-4">
              <div class="inline-grid *:[grid-area:1/1]">
                <div class="status status-success animate-ping"></div>
                <div class="status status-success"></div>
              </div>
              <h5 class="uppercase tracking-widest text-[11px] sm:text-xs md:text-sm font-semibold"> ${banner.category}</h5> 
            </div>
            <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 leading-tight">${banner.title}</h1>
            <p class="banner-description text-xs sm:text-sm md:text-base lg:text-lg font-normal pb-3 sm:pb-4 text-zinc-200 line-clamp-2 sm:line-clamp-3">${banner.description}</p>
            <button class="banner-button btn btn-xs sm:btn-sm md:btn-md rounded-full px-4 sm:px-6 shadow-md">${banner.buttonText}</button>
          </div>
        </div>
      </div>
    `;

    Offer_Banners.appendChild(Banner);
  });

  Offer_Banners.insertAdjacentHTML(
    "beforeend",
    `
    <button class="slider-btn prev-btn" aria-label="Previous slide">❮</button>
    <button class="slider-btn next-btn" aria-label="Next slide">❯</button>
    `,
  );

  startSlider();
}

function startSlider() {
  const slides = document.querySelectorAll(".banner-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const bannerContainer = document.getElementById("Offer_Banner");

  let current = 0;

  slides[current].classList.add("active");

  function showSlide(index) {
    slides[current].classList.remove("active");

    current = (index + slides.length) % slides.length;

    slides[current].classList.add("active");
  }

  let autoSlide = setInterval(() => {
    showSlide(current + 1);
  }, 3000);

  nextBtn.addEventListener("click", () => {
    showSlide(current + 1);
  });

  prevBtn.addEventListener("click", () => {
    showSlide(current - 1);
  });

  bannerContainer.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
  });

  bannerContainer.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => {
      showSlide(current + 1);
    }, 3000);
  });
}

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
      "group relative flex flex-col bg-white border border-zinc-200 rounded-2xl p-3.5 sm:p-4 hover:shadow-md transition-shadow";

    card.innerHTML = `
      <div class="relative w-full h-40 sm:h-48 bg-zinc-50 rounded-xl p-3 sm:p-4 flex items-center justify-center mb-3">
        <img src="${image}" alt="${title}" class="max-h-full max-w-full object-contain">

        <span class="absolute top-2 left-2 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs border text-zinc-500">
          ${category}
        </span>
      </div>

      <div class="flex-1 flex flex-col">
        <p class="text-xs text-amber-500 mb-1">
          ⭐ ${rating ? rating.rate : 4.5}
        </p>

        <h3 class="text-xs sm:text-sm font-medium line-clamp-2 mb-3 text-zinc-900">
          ${title}
        </h3>

        <div class="mt-auto pt-3 border-t border-zinc-100 flex justify-between items-center">
          <span class="text-xs sm:text-sm font-semibold text-zinc-900">৳ ${priceBDT}</span>

          <button onclick="addToCart(${id})"
            class="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors">
            + Add
          </button>
        </div>
      </div>
    `;

    productGrid.appendChild(card);
  }
};

// SEARCH & SORT products
function filterProducts() {
  let searchText = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();

  let sortType = document.getElementById("sort-select").value;

  let filtered = [...products];

  // 2. Filter by search text
  if (searchText !== "") {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(searchText) ||
        p.category.toLowerCase().includes(searchText),
    );
  }

  // 3. Sort products
  if (sortType === "price-asc") {
    filtered.sort((a, b) => a.priceBDT - b.priceBDT);
  } else if (sortType === "price-desc") {
    filtered.sort((a, b) => b.priceBDT - a.priceBDT);
  } else if (sortType === "name-asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  displayProducts(filtered);
}

document.getElementById("search-input").oninput = filterProducts;
document.getElementById("sort-select").onchange = filterProducts;

// Coupon state
let isCouponApplied = false;

// updateCartCount
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  document.getElementById("cart-count").textContent = totalItems;
}

updateCartCount();
displayCartProduct(cart);

// Add to cart product
function addToCart(id) {
  const product = products.find((p) => p.id === id);

  if (!product) return;

  const existingProduct = cart.find((item) => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();
  updateCartCount();
  displayCartProduct(cart);

  showToast(product.title + " added to cart!", "success");
}

document.getElementById("top-up-btn").addEventListener("click", () => {
  displayModal();
});

// Display cart products
function displayCartProduct(cart) {
  const cartProducts = document.getElementById("cart-products");

  cartProducts.innerHTML = "";

  // If cart is empty
  if (cart.length === 0) {
    cartProducts.innerHTML = `
      <div class="flex flex-col items-center justify-center py-10 text-base-content/50">
        <i class="fa-solid fa-basket-shopping text-3xl mb-2"></i>
        <p class="text-xs">Your shopping cart is empty.</p>
      </div>
    `;
    updateCartTotal();
    return;
  }

  cart.forEach((c) => {
    const cartCard = document.createElement("div");

    cartCard.className =
      "cart-item flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-2.5 sm:p-3";

    cartCard.innerHTML = `
      <div class="flex size-14 sm:size-16 shrink-0 items-center justify-center
        overflow-hidden rounded-xl bg-base-200">

        <img src="${c.image}" alt="${c.category}"
          class="h-full w-full object-contain p-1" />
      </div>

      <div class="min-w-0 flex-1">
        <h3 class="line-clamp-2 text-xs sm:text-sm font-semibold">
          ${c.title}
        </h3>

        <p class="item-price mt-1 text-xs sm:text-sm font-bold">
          ৳ ${c.priceBDT * c.quantity}
        </p>

        <div class="mt-2 flex items-center gap-2">

          <div class="flex h-7 items-center overflow-hidden rounded-lg
            border border-base-300">

            <button type="button" 
              class="qty-decrease px-2 hover:bg-base-200 cursor-pointer text-xs">
              -
            </button>

            <span class="quantity px-2 text-xs">
              ${c.quantity}
            </span>

            <button type="button" 
              class="qty-increase px-2 hover:bg-base-200 cursor-pointer text-xs">
              +
            </button>

          </div>

          <button type="button" onclick="removeFromCart(${c.id})"
            class="text-xs text-error hover:underline cursor-pointer">
            Remove
          </button>

        </div>
      </div>
    `;

    // Increase quantity
    cartCard.querySelector(".qty-increase").addEventListener("click", () => {
      updateQuantity(c.id, 1);
    });

    // Decrease quantity
    cartCard.querySelector(".qty-decrease").addEventListener("click", () => {
      updateQuantity(c.id, -1);
    });

    cartProducts.appendChild(cartCard);
  });

  updateCartTotal();
}

function updateQuantity(id, change) {
  const product = cart.find((item) => item.id === id);

  if (!product) return;

  product.quantity += change;

  if (product.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart();
  updateCartCount();
  displayCartProduct(cart);
}

const removeFromCart = (id) => {
  cart = cart.filter((c) => c.id !== id);
  saveCart();
  updateCartCount();
  displayCartProduct(cart);
};

// Update price details (subtotal, delivery, discount, total)
function updateCartTotal() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.priceBDT * item.quantity,
    0,
  );

  const deliveryFee = subtotal > 0 ? 60 : 0;
  const discount = isCouponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  document.getElementById("subtotal").textContent = "৳ " + subtotal;
  document.getElementById("delivery-fee").textContent = "৳ " + deliveryFee;
  document.getElementById("cart-total").textContent = "৳ " + total;

  const discountRow = document.getElementById("discount-row");
  const discountAmount = document.getElementById("discount-amount");

  if (discountRow && discountAmount) {
    if (discount > 0) {
      discountRow.classList.remove("hidden");
      discountRow.classList.add("flex");
      discountAmount.textContent = "- ৳ " + discount;
    } else {
      discountRow.classList.add("hidden");
      discountRow.classList.remove("flex");
    }
  }
}

// Apply coupon code
document.getElementById("apply-coupon").addEventListener("click", () => {
  const couponInput = document.getElementById("coupon-input");
  const cartMessage = document.getElementById("cart-message");
  const code = couponInput.value.trim().toUpperCase();

  if (cart.length === 0) {
    cartMessage.textContent =
      "Please add items to cart before applying coupon!";
    cartMessage.className = "mb-2 text-xs text-error block";
    return;
  }

  if (code === "") {
    cartMessage.textContent = "Please enter a coupon code!";
    cartMessage.className = "mb-2 text-xs text-error block";
    return;
  }

  if (code === "SMART10") {
    if (isCouponApplied) {
      cartMessage.textContent = "Coupon SMART10 is already applied!";
      cartMessage.className = "mb-2 text-xs text-warning block";
      return;
    }

    isCouponApplied = true;
    cartMessage.textContent = "Coupon SMART10 applied! 10% discount added.";
    cartMessage.className = "mb-2 text-xs text-emerald-600 block";
    updateCartTotal();
  } else {
    cartMessage.textContent = "Invalid coupon code! Try SMART10";
    cartMessage.className = "mb-2 text-xs text-error block";
  }
});

// Clear bag button
document.getElementById("clear-bag").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Your shopping cart is already empty!", "warning");
    return;
  }

  cart = [];
  isCouponApplied = false;

  const couponInput = document.getElementById("coupon-input");
  const cartMessage = document.getElementById("cart-message");

  if (couponInput) couponInput.value = "";
  if (cartMessage) {
    cartMessage.textContent = "";
    cartMessage.className = "mb-2 hidden text-xs";
  }

  saveCart();
  updateCartCount();
  displayCartProduct(cart);
});

// Checkout button
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast(
      "Your cart is empty! Please add products before checkout.",
      "warning",
    );
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.priceBDT * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 0 ? 60 : 0;
  const discount = isCouponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  // Check user balance limit / available funds
  if (userBalance < total) {
    showToast(
      "Insufficient balance! Total ৳ " +
        total +
        ", wallet ৳ " +
        userBalance +
        ". Please top up.",
      "error",
    );
    displayModal();
    return;
  }

  // Deduct total from wallet balance
  userBalance -= total;
  saveBalance();
  updateBalanceDisplay();

  showToast(
    "Order placed successfully! ৳ " + total + " deducted from your wallet.",
    "success",
  );

  // Reset cart and coupon
  cart = [];
  isCouponApplied = false;

  const couponInput = document.getElementById("coupon-input");
  const cartMessage = document.getElementById("cart-message");

  if (couponInput) couponInput.value = "";
  if (cartMessage) {
    cartMessage.textContent = "";
    cartMessage.className = "mb-2 hidden text-xs";
  }

  saveCart();
  updateCartCount();
  displayCartProduct(cart);

  // Close the cart drawer
  const drawerToggle = document.getElementById("my-drawer-5");
  if (drawerToggle) {
    drawerToggle.checked = false;
  }
});

// Review Banner
const reviewURL = "./Public/reviews.json";

const fetchReviewBanner = async () => {
  console.log("Fetching Review Banner Data...");
  let response = await fetch(reviewURL);
  let data = await response.json();
  ReviewCard(data);
};

fetchReviewBanner();

function ReviewCard(data) {
  const Review_Banners = document.getElementById("Review_Banner");

  data.forEach((review) => {
    const Banner = document.createElement("div");

    Banner.classList.add("review-card");

    Banner.innerHTML = `
      <div class="banner-content relative w-full h-full flex flex-col items-center justify-center px-3 sm:px-6">
        <div class="bg-white border border-zinc-200 p-4 sm:p-6 md:p-8 w-full max-w-md sm:max-w-xl md:max-w-2xl rounded-2xl shadow-sm">

          <!-- Text Content -->
          <div class="banner-Content flex flex-col items-center justify-center text-center">
            <p class="w-full text-xs sm:text-sm md:text-base text-zinc-700 font-normal py-2 sm:py-3 leading-relaxed">
              "${review.comment}"
            </p>
            <div class="reviewer flex items-center gap-3 my-2 sm:my-3">
              <img
                src="${review.avatar}"
                alt="${review.name}"
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-zinc-200">
              <p class="reviewer-name text-xs sm:text-sm font-semibold text-zinc-900">
                ${review.name}
              </p>
            </div>
            <div class="date-&-rating w-full pt-3 mt-1 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-xs text-zinc-500">
              <p class="font-medium text-amber-500">Rating: ⭐ ${review.rating} Star</p>
              <p class="text-zinc-400">Date: ${review.date}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    Review_Banners.appendChild(Banner);
  });

  Review_Banners.insertAdjacentHTML(
    "beforeend",
    `
    <button class="slider-btn2 prev-btn2" aria-label="Previous review">❮</button>
    <button class="slider-btn2 next-btn2" aria-label="Next review">❯</button>
    `,
  );

  startReviewSlider();
}

// Review Slider Function
function startReviewSlider() {
  const slides = document.querySelectorAll(".review-card");

  if (!slides.length) return;

  const prevBtn2 = document.querySelector(".prev-btn2");
  const nextBtn2 = document.querySelector(".next-btn2");
  const bannerContainer = document.getElementById("Review_Banner");

  let current = 0;

  slides[current].classList.add("active");

  function showSlide(index) {
    slides[current].classList.remove("active");

    current = (index + slides.length) % slides.length;

    slides[current].classList.add("active");
  }

  let autoSlide = setInterval(() => {
    showSlide(current + 1);
  }, 3000);

  nextBtn2.addEventListener("click", () => {
    showSlide(current + 1);
  });

  prevBtn2.addEventListener("click", () => {
    showSlide(current - 1);
  });

  bannerContainer.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
  });

  bannerContainer.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => {
      showSlide(current + 1);
    }, 3000);
  });
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
    showToast("Please fill in all fields!", "error");
    return;
  }

  submitBtn.textContent = "Submitted";
  showToast("Message sent successfully.", "success");
  contactForm.reset();
});
