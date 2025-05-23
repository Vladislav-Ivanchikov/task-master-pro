import React from "react";
import { Button, Input, FormGroup } from "@taskmaster/ui-kit";
import { useAuth } from "../context/AuthContext";
import { emailValidation } from "../utils/emailValidation";

const LoginPage = () => {
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isTouched, setIsTouched] = React.useState(false);

  const handleChangeEmail = (
    email: string,
    setEmailError: (email: string) => void
  ) => {
    setEmail(email.trim());
    emailValidation(email, setEmailError);
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
        <Button variant="primary" size="medium" onClick={handleLogin}>
          Войти
        </Button>
      </FormGroup>
    </div>
  );
};

export default LoginPage;
