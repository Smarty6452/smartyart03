
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom theme colors
				dark: {
					100: "#1A1A1A",
					200: "#121212",
					300: "#0A0A0A",
				},
				blood: "#8B0000",
				charcoal: {
					100: "#555555",
					200: "#333333",
					300: "#222222",
				},
				ghost: "#F8F8F8",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'draw-in': {
					'0%': { 'stroke-dashoffset': '1000' },
					'100%': { 'stroke-dashoffset': '0' }
				},
				'sketch-appear': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'pulse-shadow': {
					'0%, 100%': { 'box-shadow': '0 0 15px rgba(139, 0, 0, 0.5)' },
					'50%': { 'box-shadow': '0 0 30px rgba(139, 0, 0, 0.8)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'ink-spread': {
					'0%': { transform: 'scale(0)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '0.7' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.3' }
				},
				'cross-fade': {
					'0%': { opacity: '0' },
					'5%': { opacity: '1' },
					'45%': { opacity: '1' },
					'50%': { opacity: '0' },
					'100%': { opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'fade-out': 'fade-out 0.6s ease-out',
				'draw-in': 'draw-in 2s ease-out forwards',
				'sketch-appear': 'sketch-appear 0.4s ease-out',
				'pulse-shadow': 'pulse-shadow 3s infinite',
				'float': 'float 6s ease-in-out infinite',
				'ink-spread': 'ink-spread 0.8s ease-out forwards',
				'scale-in': 'scale-in 0.3s ease-out',
				'blink': 'blink 2s ease-in-out infinite',
				'cross-fade': 'cross-fade 8s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
