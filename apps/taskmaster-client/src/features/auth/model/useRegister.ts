import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterForm } from "@shared/hooks/useRegisterValidator.js";
import { registerRequest } from "@features/auth/api/authService.js";

interface ApiError {
  status?: number;
  message?: string;
}

export const useRegister = () => {
  const navigate = useNavigate();
  const formState = useRegisterForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleBlur = (field: keyof typeof formState.touched) => {
    formState.setTouched((prev) => ({ ...prev, [field]: true }));
    formState.validateField(field, formState.form[field]);
  };

  const handleSubmit = async () => {
    formState.setTouched({
      name: true,
      surname: true,
      email: true,
      password: true,
      role: true,
      termsAccepted: true,
    });

    if (!formState.validateForm()) return;

    setIsLoading(true);
    try {
      await registerRequest({
        email: formState.form.email.trim(),
        password: formState.form.password,
        name: formState.form.name.trim(),
        surname: formState.form.surname.trim(),
        role: formState.form.role,
      });
      navigate("/login");
    } catch (err) {
      const error = err as ApiError;
      if (error.status === 409) {
        formState.setErrors((prev) => ({
          ...prev,
          email: "Email already exists",
        }));
      } else {
        formState.setErrors((prev) => ({
          ...prev,
          general: error.message || "Registration failed",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    ...formState,
    isLoading,
    handleBlur,
    handleSubmit,
  };
};
