import React from "react";
import { Button, Input, FormGroup, Modal } from "@taskmaster/ui-kit";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [status, setStatus] = React.useState(false);

  const validEmail = "qwerty@gmail.com";
  const validPassword = "123456";

  const handleLogin = () => {
    if (email === validEmail && password === validPassword) {
      setStatus(true);
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/");
      }, 3000);
    } else {
      setIsModalOpen(true);
      // setTimeout(() => {
      //   setIsModalOpen(false);
      // }, 3000);
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
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          label="Email"
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
        <Modal
          isOpen={isModalOpen}
          title={status ? "Login Success" : "Login Error"}
          onClose={() => setIsModalOpen(false)}
          footer={<p>Modal footer</p>}
        >
          {status
            ? "You have successfully logged in, welcome!"
            : "Invalid email or password, please try again."}
        </Modal>
      </FormGroup>
    </div>
  );
};

export default LoginPage;
