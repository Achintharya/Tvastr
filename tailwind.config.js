import { colors, legacyColors } from './src/design/colors.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ══════════════════════════════════════════════════════════════════════
        // NEW COLOR SYSTEM - Use these for new code
        // ══════════════════════════════════════════════════════════════════════
        surface: colors.surface,
        txt: colors.text,
        brand: colors.brand,
        accent: colors.accent,
        data: colors.data,
        border: colors.border,

        // ══════════════════════════════════════════════════════════════════════
        // LEGACY ALIASES - For backward compatibility during migration
        // These map old Tailwind class names to new values
        // ══════════════════════════════════════════════════════════════════════
        bg: legacyColors.background,
        telemetry: legacyColors.telemetry,
        process: legacyColors.process,
        signal: legacyColors.signal,
      },
      fontFamily: {
        sans: ['"Elms Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Elms Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: [
          'JetBrains Mono',
          'IBM Plex Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
