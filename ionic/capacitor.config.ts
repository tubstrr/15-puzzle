import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "tubstrr.jonknoll.fifteenpuzzle",
	appName: "15 Puzzle",
	webDir: "dist",
	plugins: {
		SplashScreen: {
			launchShowDuration: 3000,
			launchAutoHide: true,
			launchFadeOutDuration: 3000,
			backgroundColor: "#ffffffff",
			androidSplashResourceName: "splash",
			androidScaleType: "CENTER_CROP",
			showSpinner: false,
			splashFullScreen: true,
			splashImmersive: true,
			layoutName: "launch_screen",
			useDialog: true,
		},
	},
};

export default config;
