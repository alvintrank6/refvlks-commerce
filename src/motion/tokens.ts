export const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.22,
    base: 0.45,
    slow: 0.8,
    cinematic: 1.2,
    thread: 0.6,
    reveal: 1,
    curtain: 0.55,
  },
  ease: {
    standard: "power2.out",
    emphasis: "power3.out",
    inOut: "power2.inOut",
    curtain: "power4.inOut",
  },
  distance: { sm: 12, md: 24, lg: 48 },
  stagger: { tight: 0.05, base: 0.09 },
  skew: { max: 4 },
  tilt: { max: 3 },
  magnetic: { max: 8 },
  marquee: { seconds: 40 },
} as const;
