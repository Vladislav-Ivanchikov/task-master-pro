import React from "react";
import { Button, Input, FormGroup, Modal } from "@taskmaster/ui-kit";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "./RegisterPage";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      login(data.token);
      console.log("Успешный вход", data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="loginCard">
      <h2>Login Task Master Pro</h2>
      <FormGroup
        label="Enter your email and password"
        error=""
        name="loginForm"
      >
        <Input
          value={email}
          onChange={(e) => handleChangeEmail(e)}
          type="email"
          label="Email"
          error={emailError}
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
        <Button variant="primary" size="medium" onClick={handleLogin}>
          Войти
        </Button>
      </FormGroup>
    </div>
  );
};

export default LoginPage;
