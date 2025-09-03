import { API_URL } from "../../src/const.js";
import { User } from "../../../../packages/types/User.js";

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    console.warn("Authentication failed, user may need to re-login");
    return null;
  }
};
