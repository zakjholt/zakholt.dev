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

// Update active navigation link
const observerOptions = {
  root: null,
  rootMargin: "-50% 0px",
  threshold: 0,
};

const observerCallback: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(
        `.nav-link[data-section="${entry.target.id}"]`
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
const contactForm = document.getElementById("contact-form") as HTMLFormElement;
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    const originalText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    try {
      await fetch("/", {
        method: "POST",
        body: new URLSearchParams(new FormData(contactForm) as any),
      });

      alert("Thanks for reaching out! I'll get back to you soon.");
      contactForm.reset();
    } catch (error) {
      alert(
        "Oops! There was a problem sending your message. Please try again."
      );
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
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
