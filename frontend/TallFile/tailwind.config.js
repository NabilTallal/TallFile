import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // make sure it points to your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [ daisyui ],
}