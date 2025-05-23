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

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = React.useState("");
  const [surname, setSurname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("USER");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }
    try {
      if (email && password && termsAccepted) {
        const response = await fetch(
          "http://localhost:8000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log("Success:", data);
        navigate("/login");
      } else {
        alert("Please fill in all fields and accept the terms of service.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="loginCard">
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
          onChange={(e) => setEmail(e.target.value.trim())}
          type="email"
          label="Email"
          placeholder="exemple@email.com"
          required
          error={emailError}
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
            value="admin"
            label="Admin"
            checked={role === "ADMIN"}
            onChange={() => setRole("ADMIN")}
          />
          <Radio
            name="role"
            value="user"
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
