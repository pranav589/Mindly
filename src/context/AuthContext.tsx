import { apiClient, setAuthTokens, getAuthToken } from "@/services/api";
import { getGoogleAuthUrl } from "@/services/oauth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useCustomAlert } from "@/context/CustomAlertContext";
import * as SecureStore from "expo-secure-store";

export interface User {
  _id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { showAlert } = useCustomAlert();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [cachedUser, setCachedUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load user profile from SecureStore on startup
  useEffect(() => {
    const loadCachedProfile = async () => {
      try {
        const profileStr = await SecureStore.getItemAsync("userProfile");
        if (profileStr) {
          setCachedUser(JSON.parse(profileStr));
        }
      } catch (err) {
        console.error("[AuthContext] Failed to load cached user profile:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    loadCachedProfile();
  }, []);

  // TanStack Query to fetch current user profile
  const {
    data: user,
    isLoading: isFetchingUser,
    refetch,
  } = useQuery({
    queryKey: ["authMe"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ user: User }>("/api/auth/me");
        const freshUser = response.data.user;
        await SecureStore.setItemAsync("userProfile", JSON.stringify(freshUser));
        setCachedUser(freshUser);
        return freshUser;
      } catch (err) {
        console.error("[AuthContext] authMe query failed:", err);
        const hasToken = getAuthToken();
        if (hasToken && cachedUser) {
          console.log("[AuthContext] Network call failed but token and cached user profile exist. Returning cache.");
          return cachedUser;
        }
        return null;
      }
    },
    retry: false,
  });

  const loginWithGoogle = async () => {
    setIsLoggingIn(true);
    try {
      const authUrl = getGoogleAuthUrl();
      const redirectUrl = Linking.createURL("redirect");

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUrl,
      );

      if (result.type === "success") {
        const { url } = result;
        const parsed = Linking.parse(url);
        const accessToken = parsed.queryParams?.accessToken as
          | string
          | undefined;
        const refreshToken = parsed.queryParams?.refreshToken as
          | string
          | undefined;

        if (accessToken && refreshToken) {
          setAuthTokens(accessToken, refreshToken);
          await refetch();
        } else {
          throw new Error("No tokens returned in callback URL.");
        }
      }
    } catch (error) {
      console.error("Google Sign In failed:", error);
      showAlert({
        title: "Error",
        message: "Failed to sign in with Google.",
        type: "error",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/api/auth/logout");
    },
    onSuccess: () => {
      setAuthTokens(null, null);
      SecureStore.deleteItemAsync("userProfile").catch(() => {});
      setCachedUser(null);
      queryClient.setQueryData(["authMe"], null);
    },
    onError: () => {
      // Wiping locally even if server logout fails (standard security practice)
      setAuthTokens(null, null);
      SecureStore.deleteItemAsync("userProfile").catch(() => {});
      setCachedUser(null);
      queryClient.setQueryData(["authMe"], null);
    },
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const isLoading = isFetchingUser || isLoggingIn || isInitializing;

  return (
    <AuthContext.Provider
      value={{
        user: user || cachedUser || null,
        isAuthenticated: !!(user || cachedUser),
        isLoading,
        loginWithGoogle,
        logout,
        isLoggingOut: logoutMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
