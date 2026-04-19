export default defineNuxtConfig({
	compatibilityDate: "2024-07-30",
	future: { compatibilityVersion: 4 },
	modules: ["@nuxt/eslint", "@vite-pwa/nuxt", "@nuxt/fonts"],
	app: {
		head: {
			title: "15 Puzzle (By Jon Knoll)",
			meta: [
				{ charset: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1, viewport-fit=cover",
				},
				{ name: "apple-mobile-web-app-capable", content: "yes" },
				{
					name: "apple-mobile-web-app-status-bar-style",
					content: "black-translucent",
				},
			],
		},
	},
	experimental: {
		appManifest: false,
	},
	nitro: {
		prerender: {
			routes: ["/", "/play", "/contact", "/privacy-policy"],
		},
		experimental: {
			openAPI: true,
		},
	},

	routeRules: {
		"/": { prerender: true },
		"/play": { prerender: true },
		"/contact": { prerender: true },
		"/privacy-policy": { prerender: true },
	},

	// Development
	devtools: { enabled: true },

	// PWA
	pwa: {
		strategies: "generateSW",
		srcDir: undefined,
		filename: undefined,
		registerType: "autoUpdate",
		manifest: {
			id: "tubstrr/15-puzzle",
			name: "15 Puzzle",
			short_name: "15 Puzzle",
			description: "A simple 15 puzzle game",
			theme_color: "#004643",
			launch_handler: {
				client_mode: "navigate-existing",
			},
			orientation: "portrait",
			icons: [
				{
					src: "pwa-192x192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "pwa-512x512.png",
					sizes: "512x512",
					type: "image/png",
				},
				{
					src: "maskable-icon-512x512",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable",
				},
				{
					src: "pwa-512x512",
					sizes: "512x512",
					type: "image/png",
					purpose: "any",
				},
			],
			categories: ["games"],
			dir: "ltr",
			prefer_related_applications: false,
			screenshots: [
				{
					src: "screenshot_1.png",
					sizes: "746/1338",
					type: "image/jpg",
					platform: "any",
				},
				{
					src: "screenshot_2.png",
					sizes: "746/1338",
					type: "image/jpg",
					platform: "any",
				},
				{
					src: "screenshot_3.png",
					sizes: "746/1338",
					type: "image/jpg",
					platform: "any",
				},
				{
					src: "screenshot_4.png",
					sizes: "746/1338",
					type: "image/jpg",
					platform: "any",
				},
			],
		},
		workbox: {
			globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
			cleanupOutdatedCaches: true,
			clientsClaim: true,
		},
		client: {
			installPrompt: true,
			// periodicSyncForUpdates: 3600,
			periodicSyncForUpdates: 1,
		},
		devOptions: {
			enabled: true,
			suppressWarnings: true,
			navigateFallback: "/",
			navigateFallbackAllowlist: [/^\/$/],
			type: "module",
		},
	},

	// Fonts
	fonts: {
		google: [
			{
				family: "Ubuntu",
				variants: ["400", "700", "900"],
			},
		],
	},
});
