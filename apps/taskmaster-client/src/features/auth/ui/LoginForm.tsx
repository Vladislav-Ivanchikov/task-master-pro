import { Button, FormGroup, Input } from "@taskmaster/ui-kit";

type LoginFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  email: string;
  onEmailChange: (email: string) => void;
  emailError: string | undefined;
  password: string;
  onPasswordChange: (password: string) => void;
};

export const LoginForm = ({
  onSubmit,
  isLoading,
  email,
  onEmailChange,
  emailError,
  password,
  onPasswordChange,
}: LoginFormProps) => (
  <FormGroup
    label="Enter your email and password"
    name="loginForm"
    onSubmit={onSubmit}
  >
    <Input
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
      type="email"
      label="Email"
      error={emailError}
      placeholder="example@email.com"
      required
    />
    <Input
      value={password}
      onChange={(e) => onPasswordChange(e.target.value)}
      type="password"
      label="Password"
      placeholder="Password"
      required
    />
    <Button type="submit" variant="primary" size="medium" disabled={isLoading}>
      Войти
    </Button>
  </FormGroup>
);
