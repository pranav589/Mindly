import * as Linking from "expo-linking";
import { API_BASE_URL } from "./api";

/**
 * Generates the deep-link redirect URI for the current Expo environment.
 * Uses the app's registered scheme ("mindly://") so the OS can hand
 * control back to the app after the browser OAuth flow completes.
 */
export const getGoogleRedirectUri = (): string => {
  return Linking.createURL("");
};

/**
 * Returns the Google login URL pointing to our backend proxy,
 * injecting the environment-specific redirect URI as the state param.
 * The backend will redirect back to this URI with accessToken & refreshToken.
 */
export const getGoogleAuthUrl = (): string => {
  const redirectUri = getGoogleRedirectUri();
  return `${API_BASE_URL}/api/auth/google?state=${encodeURIComponent(redirectUri)}`;
};
