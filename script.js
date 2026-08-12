const sections = [...document.querySelectorAll("main .section, footer.section")];
const navLinks = [...document.querySelectorAll(".side-nav a")];
document.body.classList.add("motion-ready");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

sections.forEach((section) => revealObserver.observe(section));

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: "-38% 0px -50% 0px",
  threshold: 0.01
});

sections.forEach((section) => activeObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const logo = document.querySelector('.brand img[data-fallback="logo"]');
if (logo) {
  const showLogoFallback = () => {
    logo.classList.add("is-missing");
    document.querySelector(".logo-placeholder")?.classList.add("show");
  };
  const showLogo = () => logo.classList.add("is-loaded");
  logo.addEventListener("load", showLogo, { once: true });
  logo.addEventListener("error", showLogoFallback, { once: true });
  if (logo.complete) {
    if (logo.naturalWidth > 0) showLogo();
    else showLogoFallback();
  }
}

const partnerLogo = document.querySelector('.partner-brand img[data-fallback="partner-logo"]');
if (partnerLogo) {
  const showPartnerLogo = () => partnerLogo.classList.add("is-loaded");
  const hidePartnerLogo = () => partnerLogo.hidden = true;
  partnerLogo.addEventListener("load", showPartnerLogo, { once: true });
  partnerLogo.addEventListener("error", hidePartnerLogo, { once: true });
  if (partnerLogo.complete) {
    if (partnerLogo.naturalWidth > 0) showPartnerLogo();
    else hidePartnerLogo();
  }
}

const heroImagePlaceholder = document.querySelector("[data-hero-image]");
if (heroImagePlaceholder) {
  const heroProbe = new Image();
  heroProbe.onload = () => heroImagePlaceholder.classList.add("hide");
  heroProbe.src = heroImagePlaceholder.dataset.heroImage;
}

document.querySelectorAll(".load-tour").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".tour-card");
    const shell = card?.querySelector(".iframe-shell");
    const url = card?.dataset.tour;
    if (!shell || !url || shell.querySelector("iframe")) return;

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.title = card.querySelector("h3")?.textContent || "جولة افتراضية";
    iframe.loading = "lazy";
    iframe.allow = "fullscreen; xr-spatial-tracking; gyroscope; accelerometer";
    iframe.allowFullscreen = true;

    shell.innerHTML = "";
    shell.appendChild(iframe);

    const fallback = document.createElement("div");
    fallback.className = "iframe-message";
    fallback.innerHTML = '<p>إذا لم تظهر الجولة خلال لحظات، قد يكون الموقع منع العرض داخل iframe.</p>';
    const open = document.createElement("a");
    open.className = "button primary small";
    open.href = url;
    open.target = "_blank";
    open.rel = "noopener";
    open.textContent = "فتح الرابط مباشرة";

    setTimeout(() => {
      if (!shell.contains(fallback)) {
        fallback.appendChild(open);
        shell.appendChild(fallback);
      }
    }, 4500);
  });
});

function applyImageIfExists(element, src) {
  const image = new Image();
  image.onload = () => {
    element.classList.add("has-image");
    element.style.backgroundImage = `url("${src}")`;
    element.setAttribute("aria-label", src);
  };
  image.onerror = () => {
    element.classList.remove("has-image");
  };
  image.src = src;
}

document.querySelectorAll(".gallery-item").forEach((item) => {
  const src = item.dataset.src;
  applyImageIfExists(item, src);

  item.addEventListener("click", () => {
    const lightbox = document.querySelector(".lightbox");
    const img = lightbox?.querySelector("img");
    const caption = lightbox?.querySelector("p");
    if (!lightbox || !img || !caption) return;

    if (item.classList.contains("has-image")) {
      img.hidden = false;
      img.src = src;
      caption.textContent = src;
    } else {
      img.hidden = true;
      caption.textContent = `لم تتم إضافة الصورة بعد: ${src}`;
    }

    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    }
  });
});

document.querySelector(".close-lightbox")?.addEventListener("click", () => {
  document.querySelector(".lightbox")?.close();
});

document.querySelector(".lightbox")?.addEventListener("click", (event) => {
  if (event.target.classList.contains("lightbox")) {
    event.target.close();
  }
});

document.querySelectorAll("[data-image]").forEach((element) => {
  applyImageIfExists(element, element.dataset.image);
});
