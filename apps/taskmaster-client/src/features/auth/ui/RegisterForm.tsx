import { FormGroup, Input, Toggle, Radio, Button } from "@taskmaster/ui-kit";
import PasswordStrength from "@shared/ui/PasswordStrength/PasswordStrength.js";

export function RegisterForm({
  form,
  errors,
  touched,
  onChange,
  onBlur,
  onSubmit,
  isLoading,
}: any) {
  return (
    <FormGroup label="Fill up all the required fields" name="registerForm">
      <Input
        value={form.name}
        onChange={(e) => onChange("name", e.target.value)}
        onBlur={() => onBlur("name")}
        label="Name"
        error={touched.name ? errors.name : ""}
        required
      />
      <Input
        value={form.surname}
        onChange={(e) => onChange("surname", e.target.value)}
        onBlur={() => onBlur("surname")}
        label="Surname"
        error={touched.surname ? errors.surname : ""}
        required
      />
      <Input
        value={form.email}
        onChange={(e) => onChange("email", e.target.value)}
        onBlur={() => onBlur("email")}
        label="Email"
        error={touched.email ? errors.email : ""}
        required
      />
      <Input
        value={form.password}
        onChange={(e) => onChange("password", e.target.value)}
        onBlur={() => onBlur("password")}
        label="Password"
        type="password"
        error={touched.password ? errors.password : ""}
        required
      />
      {form.password && <PasswordStrength password={form.password} />}

      <div>
        <p>Choose role</p>
        <Radio
          name="role"
          value="ADMIN"
          label="Admin"
          checked={form.role === "ADMIN"}
          onChange={() => onChange("role", "ADMIN")}
        />
        <Radio
          name="role"
          value="USER"
          label="User"
          checked={form.role === "USER"}
          onChange={() => onChange("role", "USER")}
        />
      </div>

      <Toggle
        label="I agree to the terms of service"
        checked={form.termsAccepted}
        onChange={() => onChange("termsAccepted", !form.termsAccepted)}
      />
      {touched.termsAccepted && errors.terms && <div>{errors.terms}</div>}

      <Button
        variant="primary"
        size="medium"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </FormGroup>
  );
}
