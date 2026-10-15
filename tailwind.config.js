/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          ground: '#F7F8FA', // Enterprise light page background
          card: '#FFFFFF',   // Card background
          hover: '#F3F4F6',  // Hover background
          subtle: '#F9FAFB', // Subtle row/table header background
        },
        ink: {
          primary: '#171A21',   // Strong dark charcoal
          secondary: '#697386', // Readable muted gray
          muted: '#9CA3AF',     // Tertiary subtle text
        },
        border: {
          subtle: '#E5E7EB', // Fine border
          light: '#F3F4F6',
          strong: '#D1D5DB',
        },
        brand: {
          copper: '#C47A35',       // Refined OREON copper/warm amber brand accent
          copperHover: '#B06828',
          copperLight: '#FAF4EE',
          copperBorder: '#EAD9C9',
          coral: '#C47A35',        // Alias for backward compatibility
          coralHover: '#B06828',
          coralLight: '#FAF4EE',
          charcoal: '#171A21',
          blue: '#2563EB',
          blueLight: '#EFF6FF',
        },
        status: {
          normal: '#15803D',       // Safe/Normal green
          normalBg: '#ECFDF5',
          normalBorder: '#BBF7D0',
          warning: '#D97706',      // Warning amber
          warningBg: '#FFFBEB',
          warningBorder: '#FDE68A',
          critical: '#DC2626',     // Critical hazard red
          criticalBg: '#FEF2F2',
          criticalBorder: '#FECACA',
          offline: '#6B7280',      // Inactive/disconnected gray
          offlineBg: '#F3F4F6',
          offlineBorder: '#E5E7EB',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'popover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
