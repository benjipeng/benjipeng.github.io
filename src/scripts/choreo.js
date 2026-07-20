/* ================================================================
   CHOREOGRAPHY — Lenis + GSAP ScrollTrigger
   ================================================================ */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) {
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* hero letters */
gsap.to("h1.word .ch", {
  y: 0,
  duration: 1.1,
  ease: "power4.out",
  stagger: 0.055,
  delay: 0.15,
  startAt: { y: "115%" },
});

const cube = window.__cube;
const mm = gsap.matchMedia();

mm.add("(min-width: 60.01rem)", () => {
  /* hero cube recedes toward manifesto */
  gsap.to(cube, {
    cam: 0.62, cy: 0.3, hue: 0,
    scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "top 30%", scrub: 1 },
  });

  /* manifesto pin: lines reveal, camera flies THROUGH the cube */
  const mLines = gsap.utils.toArray(".manifesto .m-line > span");
  gsap.set(mLines, { yPercent: 110 });
  const mtl = gsap.timeline({
    scrollTrigger: {
      trigger: ".manifesto", start: "top top",
      end: "+=220%", pin: true, scrub: 1,
    },
  });
  mtl.to(cube, { cam: 2.6, hue: 1, ease: "power2.inOut", duration: 3 }, 0)
     .to(mLines, { yPercent: 0, stagger: 0.8, ease: "power3.out", duration: 2 }, 0.4)
     .to(cube, { cam: 1, hue: 0, cx: 0.8, cy: 0.5, scale: 0.1, ease: "power2.inOut", duration: 2.5 }, 3.2);

  /* exhibits: horizontal scroll */
  const track = document.querySelector(".track");
  const getDist = () => track.scrollWidth - innerWidth;
  gsap.to(track, {
    x: () => -getDist(),
    ease: "none",
    scrollTrigger: {
      trigger: ".exhibits", start: "top top",
      end: () => "+=" + getDist(),
      pin: true, scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  /* inner image parallax per panel */
  gsap.utils.toArray(".panel .fig img").forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: ".exhibits", start: "top top", end: () => "+=" + getDist(), scrub: 1 },
    });
  });
  /* cube recedes behind exhibits, returns at footer */
  gsap.to(cube, {
    cam: 0.5, cx: 0.85, cy: 0.7, scale: 0.12,
    scrollTrigger: { trigger: ".exhibits", start: "top 80%", end: "top top", scrub: 1 },
  });
  gsap.to(cube, {
    cam: 1.1, cx: 0.5, cy: 0.5, scale: 0.2, hue: 0,
    scrollTrigger: { trigger: "footer", start: "top 90%", end: "top 30%", scrub: 1 },
  });
});

/* practice rows: floating image follows cursor */
const floatImg = document.getElementById("floatImg");
let fx = 0, fy = 0, tx = 0, ty = 0, imgOn = false;
document.querySelectorAll(".p-row").forEach((row) => {
  row.addEventListener("mouseenter", () => {
    floatImg.src = row.dataset.img;
    floatImg.classList.add("on");
    imgOn = true;
  });
  row.addEventListener("mouseleave", () => {
    floatImg.classList.remove("on");
    imgOn = false;
  });
});
addEventListener("pointermove", (e) => { tx = e.clientX + 28; ty = e.clientY - 90; }, { passive: true });
(function follow() {
  fx += (tx - fx) * 0.12;
  fy += (ty - fy) * 0.12;
  if (imgOn || Math.abs(tx - fx) > 0.5) {
    floatImg.style.transform = `translate(${fx}px, ${fy}px)`;
  }
  requestAnimationFrame(follow);
})();

/* rows reveal */
gsap.utils.toArray(".p-row, .c-row").forEach((el) => {
  gsap.from(el, {
    opacity: 0, y: 40, duration: 0.9, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 92%" },
  });
});
