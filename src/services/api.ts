import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_ENDPOINT;

let authToken: string | null = null;
let refreshToken: string | null = null;

export const loadStoredTokens = async () => {
  try {
    const access = await SecureStore.getItemAsync("authToken");
    const refresh = await SecureStore.getItemAsync("refreshToken");
    console.log({ access, refresh });
    authToken = access;
    refreshToken = refresh;
    return { access, refresh };
  } catch (err) {
    console.error("Failed to load tokens from SecureStore:", err);
    return { access: null, refresh: null };
  }
};

export const setAuthTokens = (
  access: string | null,
  refresh: string | null,
) => {
  authToken = access;
  refreshToken = refresh;

  if (access) {
    SecureStore.setItemAsync("authToken", access).catch((err) =>
      console.error("Failed to save auth token:", err),
    );
  } else {
    SecureStore.deleteItemAsync("authToken").catch((err) =>
      console.error("Failed to delete auth token:", err),
    );
  }

  if (refresh) {
    SecureStore.setItemAsync("refreshToken", refresh).catch((err) =>
      console.error("Failed to save refresh token:", err),
    );
  } else {
    SecureStore.deleteItemAsync("refreshToken").catch((err) =>
      console.error("Failed to delete refresh token:", err),
    );
  }
};

export const getAuthToken = () => authToken;
export const getRefreshToken = () => refreshToken;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for HTTPOnly cookie-based authentication
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach Authorization header
apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Response interceptor to handle token rotation (auth refresh) automatically on 401s
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === "/api/auth/refresh") {
        // If the refresh token endpoint itself fails (401), we reject and redirect to login
        setAuthTokens(null, null);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Rotate the access and refresh tokens
        const response = await apiClient.post<{
          accessToken: string;
          refreshToken: string;
        }>("/api/auth/refresh", { refreshToken });
        const tokens = response.data;
        setAuthTokens(tokens.accessToken, tokens.refreshToken);

        isRefreshing = false;
        processQueue(null, tokens.accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        setAuthTokens(null, null);
        isRefreshing = false;
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
