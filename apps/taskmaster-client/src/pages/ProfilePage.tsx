import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/getCurrentUser";
import { User } from "../../../../packages/types/User";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch((err) => console.error(err.message));
  }, []);

  if (!user) return <div>Loading user...</div>;

  console.log("id", user.id);

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
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ProfilePage;
