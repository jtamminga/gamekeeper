import { Auth0Provider } from '@auth0/auth0-react'
import { ReactNode } from 'react'


const authEnabled = import.meta.env.VITE_AUTH === 'true'


const AuthProvider = authEnabled
  ? ({ children }: { children: ReactNode }) =>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'read:current_user email'
      }}
    >{children}</Auth0Provider>
  : ({ children }: { children: ReactNode }) => children


export { AuthProvider }