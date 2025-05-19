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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("user");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  const handleRegister = () => {
    if (username && email && password && termsAccepted) {
      console.log("Registering user:", { username, email, password, role });
    } else {
      alert("Please fill in all fields and accept the terms of service.");
    }

    console.log("Registering user:", {
      username,
      email,
      password,
      role,
      termsAccepted,
    });

    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      return;
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
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          type="text"
          label="Username"
          placeholder="Username"
          required
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
            checked={role === "admin"}
            onChange={() => setRole("admin")}
          />
          <Radio
            name="role"
            value="user"
            label="User"
            checked={role === "user"}
            onChange={() => setRole("user")}
          />
        </div>
        <Toggle
          label="I agree to the terms of service"
          checked={termsAccepted}
          onChange={() => setTermsAccepted((prev) => !prev)}
          required
        />
        <Button variant="primary" size="medium" onClick={handleRegister}>
          Войти
        </Button>
      </FormGroup>
    </div>
  );
};

export default RegisterPage;
