import { useState } from "react";
import {
  emailValidation,
  passwordValidation,
  nameValidation,
  surnameValidation,
  validateRegisterForm,
  type FormErrors,
  type FormData,
} from "@shared/lib/validation.js";

export function useRegisterForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "USER",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    surname: "",
    email: "",
    password: "",
    terms: "",
    general: "",
  });

  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    name: false,
    surname: false,
    email: false,
    password: false,
    role: false,
    termsAccepted: false,
  });

  const updateField = <T extends keyof FormData>(
    field: T,
    value: FormData[T]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) validateField(field, value);
  };

  const validateField = <T extends keyof FormData>(
    field: T,
    value: FormData[T]
  ) => {
    let error = "";
    switch (field) {
      case "name":
        error = nameValidation(value as string).error;
        break;
      case "surname":
        error = surnameValidation(value as string).error;
        break;
      case "email":
        emailValidation(value as string, (err) => (error = err));
        break;
      case "password":
        const passVal = passwordValidation(value as string);
        error = passVal.isValid ? "" : passVal.errors.join(", ");
        break;
      case "termsAccepted":
        error = value ? "" : "You must accept the terms of service";
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [field === "termsAccepted" ? "terms" : field]: error,
    }));
  };

  const validateForm = () => {
    const validation = validateRegisterForm(form);
    setErrors(validation.errors);
    return validation.isValid;
  };

  return {
    form,
    errors,
    touched,
    setTouched,
    updateField,
    validateField,
    validateForm,
    setErrors,
  };
}
