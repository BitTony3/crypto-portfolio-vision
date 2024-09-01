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
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(230, 25%, 10%)",
        foreground: "hsl(210, 40%, 98%)",
        primary: {
          DEFAULT: "hsl(230, 100%, 67%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(230, 25%, 15%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        muted: {
          DEFAULT: "hsl(230, 25%, 20%)",
          foreground: "hsl(215, 20%, 65%)",
        },
        accent: {
          DEFAULT: "hsl(230, 100%, 75%)",
          foreground: "hsl(230, 25%, 10%)",
        },
        popover: {
          DEFAULT: "hsl(230, 25%, 12%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        card: {
          DEFAULT: "hsl(230, 25%, 13%)",
          foreground: "hsl(210, 40%, 98%)",
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
          '0%, 100%': { boxShadow: '0 0 5px hsl(230, 100%, 67%), 0 0 10px hsl(230, 100%, 67%)' },
          '50%': { boxShadow: '0 0 20px hsl(230, 100%, 67%), 0 0 30px hsl(230, 100%, 67%)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: 'glow 2s ease-in-out infinite',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(5px)',
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
