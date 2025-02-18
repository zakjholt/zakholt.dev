import "./style.css";

// Smooth scroll for navigation links
document
  .querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
  .forEach((anchor) => {
    anchor.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      const href = anchor.getAttribute("href");
      if (href) {
        // Update URL without triggering scroll
        history.pushState(null, "", href);

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
  rootMargin: "-40% 0px -50% 0px",
  threshold: [0, 1],
};

const observerCallback: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    const currentId = entry.target.id;
    const correspondingLink = document.querySelector(
      `.nav-link[data-section="${currentId}"]`
    );

    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.remove("active"));
      if (correspondingLink) {
        correspondingLink.classList.add("active");
      }
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

sections.forEach((section) => {
  observer.observe(section);
});

// Handle initial hash in URL
const initialHash = window.location.hash;
if (initialHash) {
  const targetSection = document.querySelector(initialHash);
  if (targetSection) {
    setTimeout(() => {
      targetSection.scrollIntoView({ behavior: "smooth" });
      const correspondingLink = document.querySelector(
        `.nav-link[data-section="${initialHash.slice(1)}"]`
      );
      if (correspondingLink) {
        navLinks.forEach((link) => link.classList.remove("active"));
        correspondingLink.classList.add("active");
      }
    }, 100);
  }
}

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
const animationObserverOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.2,
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      // Don't unobserve - this allows animations to replay when scrolling back up
    }
  });
}, animationObserverOptions);

// Observe all elements with animation classes
const animatedElements = document.querySelectorAll(
  ".fade-in, .slide-in-right, .slide-in-left, .pop-up, .bounce-in"
);

animatedElements.forEach((element) => {
  animationObserver.observe(element);
});

// Code toggle functionality
document
  .querySelectorAll<HTMLButtonElement>(".code-toggle")
  .forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      const codeContent = toggle.nextElementSibling as HTMLElement;
      const toggleText = toggle.querySelector("span");

      // Update button state
      toggle.setAttribute("aria-expanded", (!isExpanded).toString());

      // Update text
      if (toggleText) {
        toggleText.textContent = isExpanded ? "View Code" : "Hide Code";
      }

      // Toggle content visibility
      if (codeContent) {
        if (!isExpanded) {
          codeContent.classList.remove("hidden");
          // Use setTimeout to ensure the transition works
          setTimeout(() => {
            codeContent.classList.add("visible");
          }, 10);
        } else {
          codeContent.classList.remove("visible");
          // Wait for transition to complete before hiding
          setTimeout(() => {
            codeContent.classList.add("hidden");
          }, 300);
        }
      }
    });
  });
