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
      serverClientId: "821853079408-0lo40avkd1rmsc85u01bnu594v1n4bhn.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    }
  }
};

export default config;