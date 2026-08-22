(() => {
  if (!("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("js-reveal");

  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((item) => observer.observe(item));
})();

/* Mockups do livro: hover no desktop, toque no mobile */
(() => {
  const flips = document.querySelectorAll(".book-flip");
  if (!flips.length) return;

  const isTouch = window.matchMedia("(hover: none)").matches;

  if (isTouch) {
    document.querySelectorAll(".book-flip__hint").forEach((hint) => {
      const label = hint.lastChild;
      if (label) label.textContent = " Toque para abrir o livro";
    });
  }

  flips.forEach((flip) => {
    const toggle = () => {
      flip.classList.toggle("is-open");
      flip.setAttribute("aria-pressed", flip.classList.contains("is-open"));
    };

    flip.setAttribute("aria-pressed", "false");

    flip.addEventListener("click", toggle);

    flip.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });

    flip.addEventListener("mouseleave", () => {
      flip.classList.remove("is-open");
      flip.setAttribute("aria-pressed", "false");
    });
  });
})();
