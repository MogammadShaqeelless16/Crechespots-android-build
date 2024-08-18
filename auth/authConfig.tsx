// authConfig.ts
import { AuthRequestConfig, DiscoveryDocument } from 'expo-auth-session';

export const auth0Config = {
  domain: 'dev-5ajz6wwswmkvdwtb.us.auth0.com', // Replace with your Auth0 domain
  clientId: 'kL6qnQ2Rb0VnTFUXs8J2uWXSLxvMYtta', // Replace with your Auth0 client ID
  redirectUri: 'crechespots://redirect', // This must match the one configured in Auth0
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `https://${auth0Config.domain}/authorize`,
  tokenEndpoint: `https://${auth0Config.domain}/oauth/token`,
  revocationEndpoint: `https://${auth0Config.domain}/oauth/revoke`,
};

export { discovery };
