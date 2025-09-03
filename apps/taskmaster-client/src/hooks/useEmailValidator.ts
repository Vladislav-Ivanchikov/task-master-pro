// hooks/useEmailValidation.ts
import { useState } from "react";
import { emailValidation } from "../utils/emailValidation.js";

export function useEmailValidation() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const onChange = (value: string) => {
    setEmail(value.trim());
    emailValidation(value, setError);
  };

  return { email, setEmail, error, setError, onChange };
}
