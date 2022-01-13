import { default as appSettings } from "../assets/appsettings.deploy.json";

export const environment = {
    production: true,
    name: "production",
    mediaPlayerApiUrl: appSettings.mediaPlayerApiUrl,
    auth: {
      domain: appSettings.auth.domain,
      clientId: appSettings.auth.clientId,
      redirectUri: window.location.origin
    }
  };