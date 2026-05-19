/**
 * @file src/components/decor/BackgroundLogo.jsx
 * @description Fixed full-viewport industrial logo lattice rendered once at
 * the App root. Creates a subconscious brand texture using the Tvastr logo
 * as an ultra-subtle repeating watermark pattern.
 *
 * Design principles:
 *   - TEXTURE, not wallpaper — logo should be felt, not seen
 *   - Ultra-low opacity (0.02–0.04 range)
 *   - Large spacing (160–320px) to avoid visual noise
 *   - Monochrome silhouette treatment
 *   - Optional slow drift animation for "living runtime" feel
 *   - Respects reduced motion preferences
 *
 * This component is INTERCHANGEABLE with BackgroundGrid.jsx.
 * Use ONE or the OTHER in App.jsx, not both.
 *
 * @see design.md § Industrial decor layer
 */

import { useReducedMotionContext } from "../../animation/MotionConfig";

/**
 * Renders the fixed full-viewport industrial logo lattice.
 *
 * @param {Object} props
 * @param {number} [props.opacity=0.025] — Logo pattern opacity (0.015–0.04 recommended)
 * @param {number} [props.spacing=200] — Pattern repeat in px (160–320 recommended)
 * @param {boolean} [props.drift=true] — Enable ultra-slow background drift
 * @returns {JSX.Element}
 */
export default function BackgroundLogo({
  opacity = 0.025,
  spacing = 200,
  drift = true,
}) {
  const { reducedMotion } = useReducedMotionContext();

  // Disable drift animation under reduced motion
  const enableDrift = drift && !reducedMotion;

  return (
    <>
      {/* Logo watermark lattice — ultra-subtle brand texture */}
      <div
        aria-hidden="true"
        data-testid="background-logo"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `url("/logo.png")`,
          backgroundSize: `${spacing}px ${spacing}px`,
          backgroundRepeat: "repeat",
          // Convert orange logo to monochrome silhouette
          // grayscale removes color, brightness darkens it
          filter: "grayscale(1) brightness(0.3)",
          opacity: opacity,
          // Ultra-slow drift animation for living texture feel
          animation: enableDrift ? "logo-drift 90s ease-in-out infinite" : "none",
        }}
      />

      {/* CSS keyframes for the drift animation — injected once */}
      {enableDrift && (
        <style>{`
          @keyframes logo-drift {
            0%, 100% {
              background-position: 0 0;
            }
            25% {
              background-position: 2px 1px;
            }
            50% {
              background-position: 3px 3px;
            }
            75% {
              background-position: 1px 2px;
            }
          }
        `}</style>
      )}
    </>
  );
}
