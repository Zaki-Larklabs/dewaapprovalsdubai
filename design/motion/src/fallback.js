import gsap from "gsap";

export function createFallback() {
  const panel = document.querySelector(".drawing-panel");
  const cable = document.querySelector(".process-fallback__cable");
  const nodes = [...document.querySelectorAll(".process-fallback__nodes path")];

  return {
    setHero(progress) {
      if (!panel) return;
      const value = Math.min(1, Math.max(0, progress));
      gsap.set(panel, {
        rotateX: -2.4 + value * 2.4,
        rotateY: 2.4 - value * 4.8,
        y: value * -6,
        transformPerspective: 1200,
        transformOrigin: "50% 60%"
      });
    },
    setProcess(progress) {
      const value = Math.min(1, Math.max(0, progress));
      if (cable) gsap.set(cable, { strokeDashoffset: 1 - value });
      if (!nodes.length) return;
      const active = Math.min(nodes.length - 1, Math.floor(value * nodes.length));
      nodes.forEach((node, index) => {
        node.classList.toggle("is-live", index === active);
        node.classList.toggle("is-done", index < active);
      });
    }
  };
}
