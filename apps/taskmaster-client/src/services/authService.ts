import { API_URL } from "../const.js";

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");

  return data; // { token, user }
}

export async function registerRequest(payload: {
  email: string;
  password: string;
  name: string;
  surname: string;
  role: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "Registration failed");
    (error as any).status = response.status;
    throw error;
  }
  return data;
}
