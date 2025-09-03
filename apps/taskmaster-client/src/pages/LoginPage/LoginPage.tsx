import { useState } from "react";
import { useLogin } from "../../hooks/useLogin.js";
import { useEmailValidation } from "../../hooks/useEmailValidator.js";
import { Modal } from "@taskmaster/ui-kit";
import { LoginForm } from "../../components/LoginForm/LoginForm.js";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const {
    email,
    error: emailError,
    onChange: onEmailChange,
  } = useEmailValidation();
  const [password, setPassword] = useState("");
  const {
    handleLogin,
    isLoading,
    error: loginError,
    setError: setLoginError,
  } = useLogin();

  return (
    <div className={styles.wrapper}>
      <h2>Login Task Master Pro</h2>
      <LoginForm
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(email, password);
        }}
        isLoading={isLoading}
        email={email}
        onEmailChange={onEmailChange}
        emailError={emailError}
        password={password}
        onPasswordChange={setPassword}
      />
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
