/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(120, 100%, 3%)",
        foreground: "hsl(120, 100%, 90%)",
        primary: {
          DEFAULT: "hsl(120, 100%, 50%)",
          foreground: "hsl(120, 100%, 10%)",
        },
        secondary: {
          DEFAULT: "hsl(120, 100%, 10%)",
          foreground: "hsl(120, 100%, 90%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 100%, 50%)",
          foreground: "hsl(120, 100%, 90%)",
        },
        muted: {
          DEFAULT: "hsl(120, 100%, 5%)",
          foreground: "hsl(120, 100%, 70%)",
        },
        accent: {
          DEFAULT: "hsl(120, 100%, 60%)",
          foreground: "hsl(120, 100%, 10%)",
        },
        popover: {
          DEFAULT: "hsl(120, 100%, 5%)",
          foreground: "hsl(120, 100%, 90%)",
        },
        card: {
          DEFAULT: "hsl(120, 100%, 7%)",
          foreground: "hsl(120, 100%, 90%)",
        },
        crypto: {
          bitcoin: "#F7931A",
          ethereum: "#627EEA",
          tether: "#26A17B",
          ripple: "#00AAE4",
          cardano: "#0033AD",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px hsl(120, 100%, 50%), 0 0 10px hsl(120, 100%, 50%)' },
          '50%': { boxShadow: '0 0 20px hsl(120, 100%, 50%), 0 0 30px hsl(120, 100%, 50%)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(100%)', opacity: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: 'glow 2s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        matrixRain: 'matrixRain 5s linear infinite',
        fadeIn: 'fadeIn 1s ease-out',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(5px)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports.theme.extend.utilities = {
  '.blur-effect': {
    '& > *:not(:first-child)': {
      filter: 'blur(5px)',
      pointerEvents: 'none',
      userSelect: 'none',
    },
  },
};
