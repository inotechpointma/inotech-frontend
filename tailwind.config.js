/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      // pcportable.ma overrides Woodmart's default container to a very wide 1660px.
      screens: { "2xl": "1660px" },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "rgb(var(--color-brand) / <alpha-value>)",
          light: "rgb(var(--color-brand-light) / <alpha-value>)",
          dark: "rgb(var(--color-brand-dark) / <alpha-value>)",
        },
        header: {
          DEFAULT: "rgb(var(--color-header) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          muted: "rgb(var(--color-ink-muted) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          alt: "rgb(var(--color-surface-alt) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
        sale: "rgb(var(--color-sale) / <alpha-value>)",
        featured: "rgb(var(--color-featured) / <alpha-value>)",
        outofstock: "rgb(var(--color-outofstock) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        whatsapp: "rgb(var(--color-whatsapp) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
        badge: "var(--radius-badge)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        header: "var(--shadow-header)",
        dropdown: "var(--shadow-dropdown)",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
