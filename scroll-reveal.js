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

    /* Fechar ao tirar o mouse so faz sentido onde existe ponteiro */
    if (!isTouch) {
      flip.addEventListener("mouseleave", () => {
        flip.classList.remove("is-open");
        flip.setAttribute("aria-pressed", "false");
      });
    }
  });
})();

/* Galeria animada da autora: as tres fotos giram entre si */
(() => {
  const collage = document.querySelector("[data-author-collage]");
  if (!collage) return;

  const slots = collage.querySelectorAll(".author-photo img");
  if (slots.length < 3) return;

  const photos = [
    {
      src: "assets/foto-dani-assis.jpeg",
      alt: "Dani Assis sentada em um sofá, sorrindo",
    },
    {
      src: "assets/foto-dani-sofa.jpeg",
      alt: "Dani Assis lendo A Essência da Coragem no sofá, com uma xícara na mão",
    },
    {
      src: "assets/foto-dani-leitura.jpeg",
      alt: "Dani Assis folheando A Essência da Coragem sobre a mesa",
    },
    {
      src: "assets/foto-dani-escritorio.jpeg",
      alt: "Dani Assis lendo A Essência da Coragem em seu escritório",
    },
  ];

  photos.forEach((photo) => {
    const preload = new Image();
    preload.src = photo.src;
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let index = 0;

  window.setInterval(() => {
    index = (index + 1) % photos.length;

    slots.forEach((img, offset) => {
      const photo = photos[(index + offset) % photos.length];
      img.src = photo.src;
      img.alt = photo.alt;
      /* Reinicia a animação de revelação a cada troca */
      img.style.animation = "none";
      void img.offsetWidth;
      img.style.animation = "";
    });
  }, 2000);
})();

/* Movimento da foto acompanhando o mouse */
(() => {
  const stages = document.querySelectorAll("[data-parallax]");
  if (!stages.length) return;
  if (window.matchMedia("(hover: none)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  stages.forEach((stage) => {
    const photo = stage.querySelector(".book-stage__photo");
    if (!photo) return;

    let frame = 0;

    stage.addEventListener("mousemove", (event) => {
      if (frame) return;

      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        photo.style.transform =
          "scale(1.07) translate(" +
          (-x * 20).toFixed(2) +
          "px, " +
          (-y * 20).toFixed(2) +
          "px)";
      });
    });

    stage.addEventListener("mouseleave", () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      photo.style.transform = "";
    });
  });
})();

/* Vídeo de fundo: baixa e toca só quando a seção chega perto da tela */
(() => {
  const videos = document.querySelectorAll("[data-bg-video]");
  if (!videos.length) return;
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;

        if (!entry.isIntersecting) {
          if (!video.paused) video.pause();
          return;
        }

        if (!video.src) {
          video.src = video.dataset.bgVideo;
          video.load();
        }

        const started = video.play();
        if (started && typeof started.catch === "function") {
          /* Se o navegador recusar o autoplay, o poster continua no lugar */
          started.catch(() => {});
        }
      });
    },
    { rootMargin: "250px 0px" }
  );

  videos.forEach((video) => {
    video.muted = true;
    observer.observe(video);
  });
})();
