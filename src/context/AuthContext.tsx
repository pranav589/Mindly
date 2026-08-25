import { apiClient, setAuthTokens } from "@/services/api";
import { getGoogleAuthUrl } from "@/services/oauth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useState } from "react";

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
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
        return response.data.user;
      } catch (err) {
        console.error("[AuthContext] authMe query failed:", err);
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
      alert("Failed to sign in with Google.");
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
      queryClient.setQueryData(["authMe"], null);
    },
    onError: () => {
      // Wiping locally even if server logout fails (standard security practice)
      setAuthTokens(null, null);
      queryClient.setQueryData(["authMe"], null);
    },
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const isLoading = isFetchingUser || isLoggingIn;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
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
