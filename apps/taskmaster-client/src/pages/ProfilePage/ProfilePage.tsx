import { useEffect, useState } from "react";
import { getCurrentUser } from "@entities/user/api/getProfileService.js";
import { User } from "@appTypes/User.js";
import { Loader } from "@taskmaster/ui-kit";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getCurrentUser()
      .then((userData) => {
        setUser(userData);
        setError(null);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setError(err.message || "Failed to load profile");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" />;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <div>
      <h2>👤 Profile</h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Name:</strong> {user.name || "Not provided"}
      </p>
      <p>
        <strong>Surname:</strong> {user.surname || "Not provided"}
      </p>
      <p>
        <strong>Role:</strong> {user.role === "ADMIN" ? "Admin" : "User"}
      </p>
      <p>
        <strong>Registered:</strong>{" "}
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "Date not available"}
      </p>
    </div>
  );
};

export default ProfilePage;
