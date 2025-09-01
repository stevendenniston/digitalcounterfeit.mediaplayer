import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import './index.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Auth0Provider } from '@auth0/auth0-react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider 
      domain={import.meta.env.APP_AUTH_DOMAIN}
      clientId={import.meta.env.APP_AUTH_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.APP_AUTH_AUDIENCE,
        scope: "openid profile email read:api write:api"
      }}>
      <App />
    </Auth0Provider>
  </StrictMode>
)