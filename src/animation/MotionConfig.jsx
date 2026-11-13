/**
 * @file src/animation/MotionConfig.jsx
 * @description Application-wide Motion provider that wires Framer Motion's
 * `<MotionConfig reducedMotion="user">` and broadcasts a single
 * reduced-motion boolean (sourced from `useReducedMotion`) to both the
 * Motion_Layer and GSAP_Layer via React context.
 *
 * Implements Requirements 5.1, 5.2, 5.6 and design.md
 * § Components and Interfaces > Animation infrastructure
 * (`src/animation/MotionConfig.jsx`):
 *   - Wraps children with `<MotionConfig reducedMotion="user">` so Framer
 *     Motion delegates reduced-motion to the OS preference (Req 5.1).
 *   - Exposes `<ReducedMotionContext.Provider>` whose value is the result
 *     of `useReducedMotion()` so both Motion_Layer and GSAP_Layer hooks
 *     read the same boolean from a single source (Req 5.1, 5.2).
 *   - Re-evaluation within 500 ms of an OS preference change is delegated
 *     to `useReducedMotion`, which subscribes to the
 *     `prefers-reduced-motion` MediaQueryList's `change` event (Req 5.6).
 *   - In development, calls `validatePresets()` once at first mount so a
 *     numeric-bound regression in `motion.js` surfaces in the console at
 *     boot.
 */

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";

import { useReducedMotion } from "../hooks/useReducedMotion";
import { ReducedMotionContext } from "./reducedMotionContext";
import { validatePresets } from "./motion";

/**
 * Application-wide Motion provider. Mount once at the application root
 * (inside `<BrowserRouter>` and outside `<Routes>`).
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function MotionProvider({ children }) {
  const value = useReducedMotion();

  // Dev-time preset validator — fires once per page load on first mount so
  // a numeric-bound regression in `motion.js` surfaces in the console at
  // boot. `import.meta.env.DEV` is statically replaced by Vite, so the
  // check costs nothing and leaves no `process` reference in the browser
  // bundle.
  useEffect(() => {
    if (import.meta.env.DEV) {
      try {
        validatePresets();
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ReducedMotionContext.Provider value={value}>
        {children}
      </ReducedMotionContext.Provider>
    </MotionConfig>
  );
}
