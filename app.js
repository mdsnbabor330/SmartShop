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

  amountInput.value = "";

  document.getElementById("add-money-modal").close();
});

//Banner Function
const URL = "./Public/bannerCardData.json";

// console.log(Offer_Banner);
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
  <div class="absolute inset-0 z-10 max-w-280 mx-auto flex flex-col justify-center px-12 text-white">
       <div class="offer-Text"> 
       <div class="banner-status flex justify-items-center items-center gap-2 mb-4">
           <div class="inline-grid *:[grid-area:1/1]">
           <div class="status status-success animate-ping"></div>
             <div class="status status-success"></div>
      </div>
      <h5 class="uppercase tracking-widest text-sm"> ${banner.category}</h5> 
      </div>
      <h1 class="text-6xl font-bold mb-5">${banner.title}</h1>
          <p class="banner-description text-lg font-normal pb-4">${banner.description}</p>
          <button class="banner-button btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl rounded-4xl">${banner.buttonText}</button>
       
       </div>
      
    `;

    Offer_Banners.appendChild(Banner);
  });

  Offer_Banners.insertAdjacentHTML(
    "beforeend",
    `
    <button class="slider-btn prev-btn">❮</button>
    <button class="slider-btn next-btn">❯</button>
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

//updateCartCount
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  document.getElementById("cart-count").textContent = totalItems;
}

updateCartCount();
displayCartProduct(cart);

//add to cart product

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
}

document.getElementById("top-up-btn").addEventListener("click", () => {
  displayModal();
});

function displayCartProduct(cart) {
  const cartProducts = document.getElementById("cart-products");

  cartProducts.innerHTML = "";

  cart.forEach((c) => {
    const cartCard = document.createElement("div");

    cartCard.className =
      "cart-item flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-3";

    cartCard.innerHTML = `
      <div class="flex size-16 shrink-0 items-center justify-center
        overflow-hidden rounded-xl bg-base-200">

        <img src="${c.image}" alt="${c.category}"
          class="h-full w-full object-contain p-1" />
      </div>

      <div class="min-w-0 flex-1">
        <h3 class="line-clamp-2 text-sm font-semibold">
          ${c.title}
        </h3>

        <p class="item-price mt-1 text-sm font-bold">
          ৳ ${c.priceBDT * c.quantity}
        </p>

        <div class="mt-2 flex items-center gap-2">

          <div class="flex h-7 items-center overflow-hidden rounded-lg
            border border-base-300">

            <button type="button" 
              class="qty-decrease px-2 hover:bg-base-200 cursor-pointer">
              -
            </button>

            <span class="quantity px-2 text-xs">
              ${c.quantity}
            </span>

            <button type="button" 
              class="qty-increase px-2 hover:bg-base-200 cursor-pointer">
              +
            </button>

          </div>

          <button type="button" onclick="removeFromCart(${c.id})"
            class=" text-xs text-error hover:underline">
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

// Review Banner

const reviewURL = "./Public/reviews.json";

// console.log(Offer_Banner);
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
      <div class="bg-gray banner-content relative w-full h-full flex flex-col items-center justify-center">
      <div class="bg-white border border-indigo-500 p-5  w-9/12 h-full rounded-2xl object-cover">

  <!-- Text Content -->
          <div class="bg-white banner-Content flex flex-col items-center justify-center">
          <p class="w-8/12 banner-description text-lg text-center font-normal p-4">${review.comment}</p>
          <div class="reviewer flex items-center gap-3">
    <img
      src="${review.avatar}"
      alt="${review.name}"
      class="w-12 h-12 rounded-full object-cover">
    <p class="reviewer-name text-sm font-semibold">
      ${review.name}
    </p>
</div>    <div class="date-&-rating w-full flex justify-between">
          <p><b>Rating:  ⭐ ${review.rating} Star</b></p>
          <p><b>Date: </b> ${review.date}</p>
          
          </div>
        </div>
       </div>
      
    `;

    Review_Banners.appendChild(Banner);
  });

  Review_Banners.insertAdjacentHTML(
    "beforeend",
    `
    <button class="slider-btn2 prev-btn2">❮</button>
    <button class="slider-btn2 next-btn2">❯</button>
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
    alert("Please fill in all fields!");
    return;
  }

  submitBtn.textContent = "Submitted";
  contactForm.reset();
  window.location.reload();
});
