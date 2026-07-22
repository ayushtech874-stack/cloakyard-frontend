import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        accent: 'var(--accent)',
        'accent-dk': 'var(--accent-dk)',
        muted: 'var(--muted)',
        cream: 'var(--cream)',
        
        // Monochrome Gen Z Brutalist variables (defined in globals.css)
        "primary-fixed": "var(--primary-fixed)",
        "on-primary-container": "var(--on-primary-container)",
        "on-surface-variant": "var(--on-surface-variant)",
        "on-primary": "var(--on-primary)",
        "surface-container": "var(--surface-container)",
        "background": "var(--background)",
        "on-background": "var(--on-background)",
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        // Stitch Fonts
        "label-sm": ["Public Sans", 'sans-serif'],
        "body-md": ["Inter", 'sans-serif'],
        "headline-xl": ["Space Grotesk", 'sans-serif'],
        "headline-lg": ["Space Grotesk", 'sans-serif']
      },
      fontSize: {
        "label-sm": ["12px", {"lineHeight": "1.4", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-xl": ["64px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "headline-lg": ["40px", {"lineHeight": "1.2", "fontWeight": "600"}]
      },
      spacing: {
        "sm": "12px",
        "md": "24px",
        "xs": "4px",
        "xl": "80px",
        "lg": "48px",
        "base": "8px"
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-right': 'slideRight 0.35s ease forwards',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
export default config
