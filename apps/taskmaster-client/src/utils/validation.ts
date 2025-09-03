export interface FormErrors {
  name: string;
  surname: string;
  email: string;
  password: string;
  terms: string;
  general: string;
}

export interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  termsAccepted: boolean;
}

const regexNameSurname = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const emailValidation = (
  email: string,
  setErr: (string: string) => void
): void => {
  if (!email) {
    setErr("");
    return;
  }
  if (!isValidEmail(email)) {
    setErr("Invalid email address");
  } else {
    setErr("");
  }
};

export const passwordValidation = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const nameValidation = (
  name: string
): { isValid: boolean; error: string } => {
  if (!name.trim()) {
    return { isValid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  if (!regexNameSurname.test(name.trim())) {
    return {
      isValid: false,
      error: "Name can only contain letters and spaces",
    };
  }

  return { isValid: true, error: "" };
};

export const surnameValidation = (
  surname: string
): { isValid: boolean; error: string } => {
  if (!surname.trim()) {
    return { isValid: false, error: "Surname is required" };
  }

  if (surname.trim().length < 2) {
    return {
      isValid: false,
      error: "Surname must be at least 2 characters long",
    };
  }

  if (!regexNameSurname.test(surname.trim())) {
    return {
      isValid: false,
      error: "Surname can only contain letters and spaces",
    };
  }

  return { isValid: true, error: "" };
};

export const validateRegisterForm = (
  formData: FormData
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {
    name: "",
    surname: "",
    email: "",
    password: "",
    terms: "",
    general: "",
  };

  let isValid = true;

  const nameValidationResult = nameValidation(formData.name);
  if (!nameValidationResult.isValid) {
    errors.name = nameValidationResult.error;
    isValid = false;
  }

  const surnameValidationResult = surnameValidation(formData.surname);
  if (!surnameValidationResult.isValid) {
    errors.surname = surnameValidationResult.error;
    isValid = false;
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!isValidEmail(formData.email.trim())) {
    errors.email = "Invalid email address";
    isValid = false;
  }

  const passwordValidationResult = passwordValidation(formData.password);
  if (!passwordValidationResult.isValid) {
    errors.password = passwordValidationResult.errors.join(", ");
    isValid = false;
  }

  if (!formData.termsAccepted) {
    errors.terms = "You must accept the terms of service";
    isValid = false;
  }

  return { isValid, errors };
};
