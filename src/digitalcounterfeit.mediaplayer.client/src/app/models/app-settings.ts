export interface IAppSettings {
    env: {
        name: string;
    };
    mediaPlayerApiUrl: string;
    idpSettings: {
        authority: string;
        client_id: string;
        redirect_uri: string;
        scope: string;
        response_type: string;
        post_logout_redirect_uri: string;
        automaticSilentRenew: boolean;
        silent_redirect_uri: string;
    };
}
