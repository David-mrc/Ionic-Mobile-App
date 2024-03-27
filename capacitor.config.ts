import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ionic-mobile-app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "TO BE REPLACED",
      forceCodeForRefreshToken: true,
    }
  }
};

export default config;
