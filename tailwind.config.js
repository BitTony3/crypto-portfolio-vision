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
        border: {
          DEFAULT: "hsl(var(--border))",
          light: "hsl(210, 30%, 85%)",
          dark: "hsl(210, 30%, 20%)",
        },
        input: {
          DEFAULT: "hsl(var(--input))",
          light: "hsl(210, 30%, 97%)",
          dark: "hsl(210, 30%, 15%)",
        },
        ring: {
          DEFAULT: "hsl(var(--ring))",
          light: "hsl(210, 90%, 70%)",
          dark: "hsl(210, 90%, 30%)",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          light: "hsl(210, 60%, 98%)",
          dark: "hsl(210, 60%, 5%)",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          light: "hsl(210, 60%, 5%)",
          dark: "hsl(210, 60%, 98%)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(210, 100%, 60%)",
          dark: "hsl(210, 100%, 40%)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          light: "hsl(210, 50%, 95%)",
          dark: "hsl(210, 50%, 15%)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          light: "hsl(0, 100%, 60%)",
          dark: "hsl(0, 100%, 30%)",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          light: "hsl(210, 30%, 97%)",
          dark: "hsl(210, 30%, 15%)",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          light: "hsl(210, 90%, 70%)",
          dark: "hsl(210, 90%, 30%)",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          light: "hsl(210, 30%, 99%)",
          dark: "hsl(210, 30%, 10%)",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          light: "hsl(210, 30%, 97%)",
          dark: "hsl(210, 30%, 13%)",
          foreground: "hsl(var(--card-foreground))",
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
          '0%, 100%': { boxShadow: '0 0 5px hsl(210, 100%, 50%), 0 0 10px hsl(210, 100%, 50%)' },
          '50%': { boxShadow: '0 0 20px hsl(210, 100%, 50%), 0 0 30px hsl(210, 100%, 50%)' },
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
        lightning: {
          '0%, 100%': { opacity: 0 },
          '10%, 90%': { opacity: 0.1 },
          '20%, 80%': { opacity: 0.3 },
          '30%, 70%': { opacity: 0.5 },
          '40%, 60%': { opacity: 0.7 },
          '50%': { opacity: 1 },
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
        lightning: 'lightning 2s ease-in-out infinite',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(5px)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(to bottom right, #e0f2fe, #bfdbfe)',
        'gradient-dark': 'linear-gradient(to bottom right, #0f172a, #1e293b)',
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
  '.lightning-effect': {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      animation: 'lightning 5s infinite',
    },
  },
  '.gradient-border': {
    'border-image': 'linear-gradient(to right, #3b82f6, #60a5fa) 1',
    'border-image-slice': '1',
  },
};
