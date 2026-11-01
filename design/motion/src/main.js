import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { createFallback } from "./fallback.js";

const boot = window.__MOTION_BOOT__ || { tier: "t2" };
const root = document.documentElement;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduce) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const heroSection = document.querySelector(".hero");
  const heroPanel = document.querySelector(".drawing-panel");
  const processSection = document.querySelector("#process");
  const processVisual = document.querySelector("[data-process-visual]");
  const processCounter = document.querySelector("[data-process-counter]");
  const processSkip = document.querySelector("[data-process-skip]");
  const steps = [...document.querySelectorAll("#process .step")];
  const fallback = createFallback();

  let tier = boot.tier;
  let stage = null;
  let processTrigger = null;
  const state = { hero: 0, process: 0 };

  const setProcessUI = (progress) => {
    if (!steps.length) return;
    const value = Math.min(1, Math.max(0, progress));
    const active = Math.min(steps.length - 1, Math.floor(value * steps.length));
    steps.forEach((step, index) => {
      step.classList.toggle("is-live", index === active);
    });
    if (processCounter) {
      processCounter.textContent = `Stage 0${active + 1} / 06`;
    }
  };

  const processRange = () => tier === "t3"
    ? { start: "top top", end: "bottom bottom" }
    : { start: "top 85%", end: "bottom 40%" };

  const createProcessTrigger = () => {
    if (!processSection) return null;
    const range = processRange();
    return ScrollTrigger.create({
      trigger: processSection,
      start: range.start,
      end: range.end,
      scrub: 0.6,
      onUpdate: (self) => {
        state.process = self.progress;
        setProcessUI(self.progress);
        if (tier !== "t3") fallback.setProcess(self.progress);
        if (stage) stage.setProcessProgress(self.progress);
      }
    });
  };

  if (heroSection && heroPanel) {
    ScrollTrigger.create({
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        state.hero = self.progress;
        if (tier !== "t3") fallback.setHero(self.progress);
        if (stage) stage.setHeroProgress(self.progress);
      }
    });
  }

  processTrigger = createProcessTrigger();
  setProcessUI(0);
  fallback.setProcess(0);

  if (processSkip && processSection) {
    processSkip.addEventListener("click", () => {
      const top = processSection.offsetTop + processSection.offsetHeight - window.innerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  const enableFallback = (reason) => {
    tier = "t2";
    root.classList.remove("motion-full");
    root.classList.add("motion-css");
    if (processTrigger) processTrigger.kill();
    processTrigger = createProcessTrigger();
    fallback.setHero(state.hero);
    fallback.setProcess(state.process);
    setProcessUI(state.process);
    ScrollTrigger.refresh();
    if (window.console && window.console.warn) {
      window.console.warn(`[motion] WebGL unavailable: ${reason}`);
    }
  };

  if (tier === "t3" && heroPanel && processVisual) {
    import("./webgl.js")
      .then(({ createStage }) => {
        stage = createStage({
          canvas: document.querySelector("[data-motion-canvas]"),
          labelsLayer: document.querySelector("[data-motion-labels]"),
          hero: heroPanel,
          process: processSection,
          processVisual,
          onLost: () => enableFallback("context-lost")
        });
        root.classList.add("motion-full");
        stage.setHeroProgress(state.hero);
        stage.setProcessProgress(state.process);
        ScrollTrigger.refresh();
        window.__MOTION_STAGE__ = stage;
      })
      .catch((error) => {
        if (window.console && window.console.warn) window.console.warn(error && error.stack ? error.stack : error);
        enableFallback(error && error.message ? error.message : "import-failed");
      });
  }

  window.addEventListener("pagehide", () => {
    if (stage && stage.destroy) stage.destroy();
  }, { once: true });

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMotionChange = (event) => {
    if (event.matches) window.location.reload();
  };
  if (motionQuery.addEventListener) motionQuery.addEventListener("change", onMotionChange);
}
