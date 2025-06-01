import React from "react";
import { Button, Input, FormGroup, Modal } from "@taskmaster/ui-kit";
import { useAuth } from "../../context/AuthContext";
import { emailValidation } from "../../utils/emailValidation";
import styles from "./LoginPage.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LoginPage = () => {
  const { login } = useAuth();

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

  const handleLogin = async () => {
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

      if (!response.ok) throw new Error(data.message || "Login failed");

      const { token, user } = data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      if (!response.ok) throw new Error(data.message || "Login failed");

      login(token, user);
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
        error=""
        name="loginForm"
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
          variant="primary"
          size="medium"
          onClick={handleLogin}
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
