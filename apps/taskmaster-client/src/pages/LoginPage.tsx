import { Button, Input } from "@taskmaster/ui-kit";

const LoginPage = () => {
  return (
    <div className="loginCard">
      <h2>LoginPage</h2>
      <Input type="email" label="Login input" required={true} />
      <Input type="password" label="Password input" required={true} />
      <Button variant="primary" size="medium">
        Войти
      </Button>
    </div>
  );
};

export default LoginPage;
