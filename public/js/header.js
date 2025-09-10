const nav = document.querySelector(".nav-links");
const navToggle = document.querySelector('.menu-icon');

let showNav = false;

navToggle.addEventListener('click', () => {
  showNav = !showNav;
  nav.classList.toggle('active');

  navToggle.innerHTML = showNav ? "&times;" : "&#9776;";
});

// ✅ Add scroll event ONCE outside the click event
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    nav.classList.remove("active");
    navToggle.innerHTML = "&#9776;";
    showNav = false;
  }
});



// Blog post section

