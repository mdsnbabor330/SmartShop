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
