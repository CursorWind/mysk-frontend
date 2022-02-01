module.exports = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#00658f",
          "on-primary": "#ffffff",
          "primary-container": "#c5e7ff",
          "on-primary-container": "#001e2e",
          secondary: "#b50077",
          "on-secondary": "#ffffff",
          "secondary-container": "#ffd8e8",
          "on-secondary-container": "#3d0025",
          tertiary: "#6f5d00",
          "on-tertiary": "#ffffff",
          "tertiary-container": "#ffe24c",
          "on-tertiary-container": "#221b00",
          error: "#ba1b1b",
          "error-container": "#ffdad4",
          "on-error": "#ffffff",
          "on-error-container": "#410001",
          background: "#fbfcff",
          "on-background": "#191c1e",
          surface: "#fbfcff",
          "on-surface": "#191c1e",
          "surface-variant": "#dde3ea",
          "on-surface-variant": "#41484d",
          outline: "#71787e",
          "inverse-on-surface": "#f0f1f4",
          "inverse-surface": "#2e3133",
          "inverse-primary": "#80cfff",
          shadow: "#000000",
          surface1: "#fbfcff",
          surface2: "#fbfcff",
          surface3: "#fbfcff",
          surface4: "#fbfcff",
          surface5: "#fbfcff",
          black: "#000000",
          white: "#ffffff",
        },
        dark: {
          primary: "#80cfff",
          "on-primary": "#00344c",
          "primary-container": "#004c6d",
          "on-primary-container": "#c5e7ff",
          secondary: "#ffafd5",
          "on-secondary": "#62003e",
          "secondary-container": "#8b005a",
          "on-secondary-container": "#ffd8e8",
          tertiary: "#e4c521",
          "on-tertiary": "#3a3000",
          "tertiary-container": "#544600",
          "on-tertiary-container": "#ffe24c",
          error: "#ffb4a9",
          "error-container": "#930006",
          "on-error": "#680003",
          "on-error-container": "#ffdad4",
          background: "#191c1e",
          "on-background": "#e1e2e5",
          surface: "#191c1e",
          "on-surface": "#e1e2e5",
          "surface-variant": "#41484d",
          "on-surface-variant": "#c1c7ce",
          outline: "#8b9197",
          "inverse-on-surface": "#191c1e",
          "inverse-surface": "#e1e2e5",
          "inverse-primary": "#00658f",
          shadow: "#000000",
          surface1: "#191c1e",
          surface2: "#191c1e",
          surface3: "#191c1e",
          surface4: "#191c1e",
          surface5: "#191c1e",
          white: "#ffffff",
          black: "#000000",
        },
      },
      fontSize: {
        xs: "0.6875rem",
        sm: "0.75rem",
        base: "0.875rem",
        lg: "1rem",
        xl: "1.125rem",
        "2xl": "1.375rem",
        "3xl": "1.5rem",
        "4xl": "1.75rem",
        "5xl": "2rem",
        "6xl": "2.25rem",
        "7xl": "2.8125rem",
        "8xl": "3.5625rem",
        "9xl": "4rem",
      },
      fontFamily: {
        display: ["Inter", "Noto Sans Thai", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "Sarabun", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        none: "0",
        xs: "0.0625rem",
        sm: "0.125rem",
        default: "0.1875rem",
        lg: "0.3125rem",
        xl: "0.75rem",
        "2xl": "1.125rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
        "5xl": "1.625rem",
        "6xl": "1.75rem",
        "7xl": "1.875rem",
        "8xl": "2.25rem",
        "9xl": "2.5rem",
        "10xl": "3.125rem",
        full: "9999px",
      },
      boxShadow: {
        DEFAULT: "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)",
        md: "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)",
        lg: "0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)",
        xl: "0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)",
        "2xl": "0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)",
      },
    },
    screens: {
      sm: "820px",
      md: "1240px",
      lg: "1440px",
    },
  },
  plugins: [],
};
