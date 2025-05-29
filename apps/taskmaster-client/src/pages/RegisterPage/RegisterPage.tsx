import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormGroup,
  Input,
  Toggle,
  Radio,
  Modal,
} from "@taskmaster/ui-kit";
import { emailValidation } from "../../utils/emailValidation";
import styles from "./RegisterPage.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("USER");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [isTouched, setIsTouched] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [registerError, setRegisterError] = React.useState("");

  const handleChangeEmail = (
    email: string,
    setEmailError: (email: string) => void
  ) => {
    setEmail(email.trim());
    emailValidation(email, setEmailError);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setRegisterError("");
    try {
      if (email && password && termsAccepted) {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name, surname, role }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        navigate("/login");
      } else {
        setRegisterError(
          "Please fill in all fields and accept the terms of service."
        );
      }
    } catch (error: Error | unknown) {
      if (error instanceof Error) {
        setRegisterError(
          error.message || "An error occurred during registration"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Register Task Master Pro</h2>
      <FormGroup
        label="Fill up all the required fields"
        error=""
        name="loginForm"
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value.trim())}
          type="text"
          label="Name"
          placeholder="Name"
        />
        <Input
          value={surname}
          onChange={(e) => setSurname(e.target.value.trim())}
          type="text"
          label="Surname"
          placeholder="Surname"
        />
        <Input
          value={email}
          onChange={(e) =>
            handleChangeEmail(e.target.value.trim(), setEmailError)
          }
          onBlur={() => setIsTouched(true)}
          type="email"
          label="Email"
          placeholder="exemple@email.com"
          required
          error={isTouched ? emailError : ""}
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
          type="password"
          label="Password"
          placeholder="Password"
          required
        />
        <div className="ratio">
          <p>Choose role</p>
          <Radio
            name="role"
            value="ADMIN"
            label="Admin"
            checked={role === "ADMIN"}
            onChange={() => setRole("ADMIN")}
          />
          <Radio
            name="role"
            value="USER"
            label="User"
            checked={role === "USER"}
            onChange={() => setRole("USER")}
          />
        </div>
        <Toggle
          label="I agree to the terms of service"
          checked={termsAccepted}
          onChange={() => setTermsAccepted((prev) => !prev)}
          required
        />
        <Button variant="primary" size="medium" onClick={handleRegister}>
          Зарегистрироваться
        </Button>
      </FormGroup>
    </div>
  );
};

export default RegisterPage;
