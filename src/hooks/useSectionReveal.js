/**
 * @file src/hooks/useSectionReveal.js
 * @description GSAP/ScrollTrigger-backed section reveal hook that replaces
 * the legacy CSS-class-based scroll reveal. Drives the heading → subheading
 * → grid-items cascade for every marketing/section component.
 */

import { useEffect } from "react";

import { gsap, ScrollTrigger } from "../animation/gsap";
import { useReducedMotionContext } from "../animation/MotionConfig";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const TABLET_VIEWPORT_MIN_PX = 640;
const TABLET_VIEWPORT_MAX_PX = 1024;
const TABLET_DURATION_MULTIPLIER = 0.7;

const DURATION_MIN_MS = 400;
const DURATION_MAX_MS = 900;
const OFFSET_MIN_PX = 16;
const OFFSET_MAX_PX = 48;
const STAGGER_MIN_MS = 40;
const STAGGER_MAX_MS = 120;
const STAGGER_WINDOW_MAX_MS = 1500;
const CLEAR_PROPS_DELAY_MS = 50;

function tabletDurationMultiplier() {
  if (typeof window === "undefined") return 1;
  const width = window.innerWidth;
  return width >= TABLET_VIEWPORT_MIN_PX && width <= TABLET_VIEWPORT_MAX_PX
    ? TABLET_DURATION_MULTIPLIER
    : 1;
}

function effectiveItemStaggerSeconds(clampedStaggerMs, itemCount) {
  if (itemCount <= 1) return clampedStaggerMs / 1000;
  const cappedMs = Math.min(
    clampedStaggerMs,
    STAGGER_WINDOW_MAX_MS / (itemCount - 1),
  );
  return cappedMs / 1000;
}

export function useSectionReveal(ref, options = {}) {
  const { reducedMotion } = useReducedMotionContext();

  const {
    headingSelector = "h1, h2",
    subheadingSelector = "[data-subheading]",
    itemsSelector = "[data-reveal-item]",
    threshold = 0.15,
    duration: durationRaw = 600,
    offset: offsetRaw = 32,
    stagger: staggerRaw = 80,
  } = options;

  useEffect(() => {
    const root = ref?.current;
    if (!root) return undefined;

    const heading = root.querySelector(headingSelector);
    const subheading = root.querySelector(subheadingSelector);
    const items = Array.from(root.querySelectorAll(itemsSelector));
    const allTargets = [heading, subheading, ...items].filter(Boolean);
    if (allTargets.length === 0) return undefined;

    const clampedDurationMs = clamp(durationRaw, DURATION_MIN_MS, DURATION_MAX_MS);
    const clampedOffsetPx = clamp(offsetRaw, OFFSET_MIN_PX, OFFSET_MAX_PX);
    const clampedStaggerMs = clamp(staggerRaw, STAGGER_MIN_MS, STAGGER_MAX_MS);

    const durationSeconds = (clampedDurationMs * tabletDurationMultiplier()) / 1000;
    const itemStaggerSeconds = effectiveItemStaggerSeconds(clampedStaggerMs, items.length);

    if (reducedMotion) {
      gsap.set(allTargets, { opacity: 1, y: 0, clearProps: "transform,opacity" });
      return undefined;
    }

    gsap.set(allTargets, { opacity: 0, y: clampedOffsetPx });

    let clearTimeoutId = null;

    const clearInlineStyles = () => {
      gsap.set(allTargets, { clearProps: "transform,opacity" });
    };

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: `top bottom-=${threshold * 100}%`,
      once: true,
      onEnter: () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            clearTimeoutId = setTimeout(() => {
              clearTimeoutId = null;
              clearInlineStyles();
            }, CLEAR_PROPS_DELAY_MS);
          },
        });

        if (heading) {
          timeline.to(heading, { opacity: 1, y: 0, duration: durationSeconds }, 0);
        }
        if (subheading) {
          timeline.to(subheading, { opacity: 1, y: 0, duration: durationSeconds }, 0.05);
        }
        if (items.length > 0) {
          timeline.to(items, {
            opacity: 1,
            y: 0,
            duration: durationSeconds,
            stagger: itemStaggerSeconds,
          }, 0.1);
        }
      },
    });

    return () => {
      if (clearTimeoutId !== null) {
        clearTimeout(clearTimeoutId);
        clearTimeoutId = null;
      }
      trigger.kill();
    };
  }, [ref, reducedMotion, headingSelector, subheadingSelector, itemsSelector, threshold, durationRaw, offsetRaw, staggerRaw]);
}

export default useSectionReveal;
