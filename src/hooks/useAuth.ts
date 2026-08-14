import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithGoogle,
    logout,
    isLoggingOut,
  } = useAuthContext();

  return {
    user,
    isAuthenticated,
    isLoading,
    loginWithGoogle,
    logout,
    isLoggingOut,
  };
}
