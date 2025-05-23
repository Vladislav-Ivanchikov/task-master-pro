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
