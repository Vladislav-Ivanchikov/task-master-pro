import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRegisterForm } from "../../hooks/useRegisterValidator.js";
import { registerRequest } from "../../services/authService.js";
import { RegisterForm } from "../../components/RegisterForm/RegisterForm.js";
import styles from "./RegisterPage.module.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    form,
    errors,
    touched,
    setTouched,
    updateField,
    validateField,
    validateForm,
    setErrors,
  } = useRegisterForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const handleSubmit = async () => {
    setTouched({
      name: true,
      surname: true,
      email: true,
      password: true,
      role: true,
      termsAccepted: true,
    });

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerRequest({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        surname: form.surname.trim(),
        role: form.role,
      });
      navigate("/login");
    } catch (err: any) {
      if (err.status === 409)
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      else setErrors((prev) => ({ ...prev, general: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Register Task Master Pro</h2>
      {errors.general && (
        <div className={styles.errorBanner}>{errors.general}</div>
      )}
      <RegisterForm
        form={form}
        errors={errors}
        touched={touched}
        onChange={updateField}
        onBlur={handleBlur}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
