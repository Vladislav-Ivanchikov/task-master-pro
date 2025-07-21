import React from "react";
import { Button, Input, FormGroup, Modal, useToast } from "@taskmaster/ui-kit";
import { useAuth } from "../../context/AuthContext";
import { emailValidation } from "../../utils/emailValidation";
import styles from "./LoginPage.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast(); // Assuming showToast is provided by AuthContext

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isTouched, setIsTouched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loginError, setLoginError] = React.useState("");

  const handleChangeEmail = (
    email: string,
    setEmailError: (email: string) => void
  ) => {
    setEmail(email.trim());
    emailValidation(email, setEmailError);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) setEmailError(data.message || "Login failed");

      const { token, user } = data;
      if (!token || !user) {
        setEmailError("Invalid response from server");
      }

      login(token, user);
      showToast({ message: "Login successful", type: "success" });
    } catch (error: any) {
      setLoginError(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Login Task Master Pro</h2>
      <FormGroup
        label="Enter your email and password"
        name="loginForm"
        onSubmit={handleLogin}
      >
        <Input
          value={email}
          onChange={(e) =>
            handleChangeEmail(e.target.value.trim(), setEmailError)
          }
          onBlur={() => setIsTouched(true)}
          type="email"
          label="Email"
          error={isTouched ? emailError : ""}
          placeholder="exemple@email.com"
          required
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label="Password"
          placeholder="Password"
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={isLoading}
        >
          Войти
        </Button>
      </FormGroup>
      <Modal
        isOpen={!!loginError}
        onClose={() => setLoginError("")}
        title="Login Error"
      >
        {loginError}
      </Modal>
    </div>
  );
};

export default LoginPage;
