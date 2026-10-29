const navLinks = document.querySelectorAll(".navlink");

let userBalance = 1000;

if (localStorage.getItem("smartshop_balance")) {
  userBalance = Number(localStorage.getItem("smartshop_balance"));
}
function saveBalance() {
  localStorage.setItem("smartshop_balance", userBalance);
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
  <div class="absolute inset-0 z-10 flex flex-col justify-center px-12 text-white">
       <div class="offer-Text"> 
       <div class="banner-status flex justify-items-center items-center gap-2 mb-4">
           <div class="inline-grid *:[grid-area:1/1]">
           <div class="status status-error animate-ping"></div>
             <div class="status status-error"></div>
      </div>
      <h5 class="uppercase tracking-widest text-sm"> ${banner.category}</h5> 
      </div>
      <h1 class="text-6xl font-bold p-4">${banner.title}</h1>
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
