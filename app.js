const navLinks = document.querySelectorAll(".navlink");

let userBalance = 1000;

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

  updateBalanceDisplay();

  amountInput.value = "";

  document.getElementById("add-money-modal").close();
});


const heroContainer = document.getElementById("hero-slides");
const dotsContainer = document.getElementById("slider-dots");

let currentSlide = 0;
let sliderInterval;

// Generate slides
heroContainer.innerHTML = heroSlides
  .map((slide) => {
    return `
      <div class="min-w-full h-full relative flex items-center">

        <img
          src="${slide.image}"
          alt="${slide.alt}"
          class="absolute inset-0 w-full h-full object-cover opacity-50"
        >

        <div class="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>

        <div class="relative z-10 px-8 sm:px-16 md:px-20 max-w-2xl text-white">

          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            <span class="w-1.5 h-1.5 rounded-full ${
              slide.highlight ? "bg-emerald-400" : "bg-zinc-100"
            }"></span>
            ${slide.category}
          </span>

          <h2 class="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white leading-tight">
            ${slide.title}
          </h2>

          <p class="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
            ${slide.description}
          </p>

          <div class="mt-8 flex items-center gap-3">

            <a href="${slide.buttonLink}"
              class="px-5 py-2.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 font-semibold text-xs transition-all">
              ${slide.buttonText}
            </a>

            ${
              slide.topUpButton
                ? `<button onclick="document.getElementById('quick-add-money-btn').click()"
                    class="px-5 py-2.5 rounded-full bg-zinc-800/80 text-white text-xs border border-zinc-700">
                    + Top Up Wallet
                  </button>`
                : ""
            }

          </div>
        </div>
      </div>
    `;
  })
  .join("");


// Generate dots
dotsContainer.innerHTML = heroSlides
  .map((slide, index) => `
    <button
      onclick="goToSlide(${index})"
      class="slider-dot h-2 rounded-full transition-all duration-300 ${
        index === 0 ? "w-7 bg-white" : "w-2 bg-white/50"
      }"
      aria-label="Go to slide ${index + 1}"
    ></button>
  `)
  .join("");


// Update slider
function updateSlider() {
  heroContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

  document.querySelectorAll(".slider-dot").forEach((dot, index) => {
    dot.classList.toggle("w-7", index === currentSlide);
    dot.classList.toggle("w-2", index !== currentSlide);

    dot.classList.toggle("bg-white", index === currentSlide);
    dot.classList.toggle("bg-white/50", index !== currentSlide);
  });
}


// Next slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % heroSlides.length;
  updateSlider();
}

// Previous slide
function prevSlide() {
  currentSlide =
    (currentSlide - 1 + heroSlides.length) % heroSlides.length;

  updateSlider();
}

// Go to selected slide
function goToSlide(index) {
  currentSlide = index;
  updateSlider();
  restartSlider();
}


// Automatic slider
function startSlider() {
  sliderInterval = setInterval(nextSlide, 5000);
}

// Restart automatic slider
function restartSlider() {
  clearInterval(sliderInterval);
  startSlider();
}


// Button events
document.getElementById("next-slide").addEventListener("click", () => {
  nextSlide();
  restartSlider();
});

document.getElementById("prev-slide").addEventListener("click", () => {
  prevSlide();
  restartSlider();
});


// Initialize
updateSlider();
startSlider();
