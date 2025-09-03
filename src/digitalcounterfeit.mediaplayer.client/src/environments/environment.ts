import { default as appSettings } from "../assets/appsettings.json";

export const environment = {
    production: true,
    name: "production",
    mediaPlayerApiUrl: appSettings.mediaPlayerApiUrl,
    auth: {
      audience: appSettings.auth.audience,
      clientId: appSettings.auth.clientId,
      domain: appSettings.auth.domain,
      redirectUri: window.location.origin,
      scope: appSettings.auth.scope
    }
  };