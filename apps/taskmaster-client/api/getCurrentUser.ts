export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  try {
    const response = await fetch("http://localhost:8000/api/auth/me", {
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
    return null;
  }
};
