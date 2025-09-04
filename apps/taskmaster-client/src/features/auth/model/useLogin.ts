import { useState } from "react";
import { useAuth } from "@app/context/AuthContext.js";
import { useToast } from "@taskmaster/ui-kit";
import { loginRequest } from "../api/authService.js";

export function useLogin() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");
    try {
      const { token, user } = await loginRequest(email, password);
      login(token, user);
      showToast({ message: "Login successful", type: "success" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error, setError };
}
