const navLinks = document.querySelectorAll(".navlink");

function toggleStyle(id) {
  navLinks.forEach((link) => {
    // Reset all links
    link.classList.remove("font-bold", "border-b-2");
    link.classList.add("font-medium");

    //selected links
    if (link.dataset.id == id) {
      link.classList.remove("font-medium");
      link.classList.add("font-bold", "border-b-2");
    }
  });
}
