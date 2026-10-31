(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const navBar = document.querySelector(".nav-bar");
  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle && navBar) {
    navToggle.addEventListener("click", () => {
      const open = navBar.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navBar.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navBar.classList.contains("is-open")) {
        navBar.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
    navBar.querySelectorAll(".nav-list a").forEach((link) => {
      link.addEventListener("click", () => {
        navBar.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", (event) => {
      if (navBar.classList.contains("is-open") && !navBar.contains(event.target)) {
        navBar.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal], .section-rule, .process, .stamp");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.classList.add("is-in");
      if (item.classList.contains("process")) item.classList.add("is-energised");
      if (item.classList.contains("stamp")) item.classList.add("is-pressed");
    });
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-in");
          if (el.classList.contains("process")) {
            el.classList.add("is-energised");
            el.querySelectorAll(".step").forEach((step, index) => {
              window.setTimeout(() => step.classList.add("is-live"), 160 + index * 120);
            });
          }
          if (el.classList.contains("stamp")) {
            el.classList.add("is-pressed");
          }
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  const sheetIndicator = document.querySelector("[data-sheet-indicator]");
  const sheets = [...document.querySelectorAll("[data-sheet]")];
  if (sheetIndicator && sheets.length && "IntersectionObserver" in window) {
    const sheetObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const value = visible.target.getAttribute("data-sheet");
        sheetIndicator.innerHTML = `SHT <span>${value}</span> / 09`;
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.05, 0.25, 0.5] }
    );
    sheets.forEach((sheet) => sheetObserver.observe(sheet));
  }

  document.querySelectorAll("[data-pathfinder]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = document.querySelector("[data-pathfinder-result]");
      if (!result) return;
      result.hidden = false;
      const property = form.querySelector('[name="property"]')?.value || "Commercial unit";
      const activity = form.querySelector('[name="activity"]')?.value || "Fit-out";
      const situation = form.querySelector('[name="situation"]')?.value || "Existing supply";
      const title = result.querySelector("[data-route-title]");
      if (title) title.textContent = `${property} / ${activity} / ${situation}`;
      result.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      const firstLink = result.querySelector("a, button");
      if (firstLink) firstLink.focus({ preventScroll: true });
    });
  });

  document.querySelectorAll("[data-validate]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let firstInvalid = null;
      form.querySelectorAll("[required]").forEach((field) => {
        const wrapper = field.closest(".field, .checkline");
        const message = wrapper?.querySelector(".field-error");
        const valid = field.type === "checkbox" ? field.checked : field.value.trim() !== "";
        if (wrapper) wrapper.dataset.invalid = valid ? "false" : "true";
        if (!valid && !firstInvalid) firstInvalid = field;
        if (message) message.hidden = valid;
        field.setAttribute("aria-invalid", valid ? "false" : "true");
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      const status = form.querySelector("[data-form-status]");
      if (status) {
        status.hidden = false;
        status.focus();
      }
    });
    form.querySelectorAll("[required]").forEach((field) => {
      field.addEventListener("input", () => {
        const wrapper = field.closest(".field, .checkline");
        const message = wrapper?.querySelector(".field-error");
        if (wrapper) wrapper.dataset.invalid = "false";
        if (message) message.hidden = true;
        field.setAttribute("aria-invalid", "false");
      });
    });
  });

  const search = document.querySelector("[data-faq-search]");
  const faqItems = [...document.querySelectorAll("[data-faq-item]")];
  const faqSections = [...document.querySelectorAll(".faq-category")];
  const searchStatus = document.querySelector("[data-search-status]");
  const empty = document.querySelector("[data-faq-empty]");
  const categoryButtons = [...document.querySelectorAll("[data-category-filter]")];
  let activeCategory = "all";

  if (faqItems.length) {
    const applyFilter = () => {
      const query = search ? search.value.trim().toLowerCase() : "";
      let count = 0;

      faqItems.forEach((item) => {
        const categoryMatch =
          activeCategory === "all" || item.getAttribute("data-category") === activeCategory;
        const queryMatch = query === "" || item.textContent.toLowerCase().includes(query);
        const match = categoryMatch && queryMatch;
        item.hidden = !match;
        if (!match) item.open = false;
        if (match) count += 1;
      });

      faqSections.forEach((section) => {
        const visible = [...section.querySelectorAll("[data-faq-item]")].some((item) => !item.hidden);
        section.hidden = !visible;
      });

      if (searchStatus) {
        if (query) {
          searchStatus.textContent = `${count} question${count === 1 ? "" : "s"} match "${query}"`;
        } else if (activeCategory !== "all") {
          searchStatus.textContent = `${count} question${count === 1 ? "" : "s"} in this category`;
        } else {
          searchStatus.textContent = `${faqItems.length} questions in this view`;
        }
      }
      if (empty) empty.style.display = count === 0 ? "block" : "none";
    };

    if (search) {
      search.addEventListener("input", () => {
        if (activeCategory !== "all") {
          activeCategory = "all";
          categoryButtons.forEach((button) => {
            button.setAttribute(
              "aria-current",
              button.getAttribute("data-category-filter") === "all" ? "true" : "false"
            );
          });
        }
        applyFilter();
      });
    }
    categoryButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.getAttribute("data-category-filter") || "all";
        categoryButtons.forEach((item) => {
          item.setAttribute("aria-current", item === button ? "true" : "false");
        });
        applyFilter();
      });
    });
    applyFilter();
  }
})();
