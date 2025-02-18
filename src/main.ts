import "./style.css";

// Smooth scroll for navigation links
document
  .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
  .forEach((anchor) => {
    anchor.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      const href = anchor.getAttribute("href");
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });

// Scroll-aware navigation
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");

const observerOptions = {
  root: null,
  rootMargin: "-50% 0px", // Only consider the middle 50% of the viewport
  threshold: 0,
};

const observerCallback: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Remove active class from all nav links
      navLinks.forEach((link) => link.classList.remove("active"));

      // Add active class to current section's nav link
      const activeId = entry.target.id;
      const activeLink = document.querySelector(
        `.nav-link[data-section="${activeId}"]`
      );
      if (activeLink) {
        activeLink.classList.add("active");
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach((section) => {
  observer.observe(section);
});

// Form handling
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    // Here you would typically send the data to your backend
    console.log("Form submitted:", data);

    // For now, just show a success message
    alert("Thanks for reaching out! I'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
  });
}

// Animation observer
const fadeObserverOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      fadeObserver.unobserve(entry.target);
    }
  });
}, fadeObserverOptions);

document.querySelectorAll(".animate-on-scroll").forEach((element) => {
  fadeObserver.observe(element);
});
