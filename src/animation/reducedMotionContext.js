import { createContext, useContext } from "react";

/**
 * @typedef {{ reducedMotion: boolean, detectionFailed: boolean }} ReducedMotionState
 */

/**
 * Context broadcast of the resolved reduced-motion state. Both
 * Motion_Layer and GSAP_Layer hooks read from this single source so the
 * two libraries can never drift on the user's preference.
 *
 * Default value matches the shape returned by `useReducedMotion` so
 * components rendered outside the provider (e.g. isolated tests) get a
 * safe `{ reducedMotion: false, detectionFailed: false }` rather than
 * `undefined`.
 *
 * @type {React.Context<ReducedMotionState>}
 */
export const ReducedMotionContext = createContext({
  reducedMotion: false,
  detectionFailed: false,
});

/**
 * Read the broadcast reduced-motion state inside the Motion_Layer or
 * GSAP_Layer. Equivalent to `useContext(ReducedMotionContext)` but exposes
 * a stable hook name for consumers.
 *
 * @returns {ReducedMotionState}
 */
export function useReducedMotionContext() {
  return useContext(ReducedMotionContext);
}
