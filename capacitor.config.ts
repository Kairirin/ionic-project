import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'irene.ionic.project',
  appName: 'ionic-project',
  webDir: 'www',
  android: {
    allowMixedContent: true
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#0054e9",
    },
  },
};

export default config;
