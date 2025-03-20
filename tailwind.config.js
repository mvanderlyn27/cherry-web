/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sansita': ['SansitaOne', 'sans-serif'],
        // Add other custom fonts here
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'scaleIn': 'scaleIn 0.5s ease-in-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(168,85,247,0)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 15px 2px rgba(168,85,247,0.6)' }
        }
      }
    },
  },
  plugins: [],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
