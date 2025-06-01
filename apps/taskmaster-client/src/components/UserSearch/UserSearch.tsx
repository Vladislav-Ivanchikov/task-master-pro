import { useEffect, useState } from "react";
import { Input } from "@taskmaster/ui-kit";
import styles from "./UserSearch.module.css";
import { useAuth } from "../../context/AuthContext";
import { BoardMember } from "../../../../../packages/types/BoardMember";

type UserSearchProps = {
  onSelect: (user: BoardMember) => void;
  onSuccess: () => void;
};

const UserSearch = ({ onSelect }: UserSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(false);

  const { VITE_API_URL } = import.meta.env;
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${VITE_API_URL}/api/users/search?query=${query}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchUsers, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className={styles.userSearch}>
      <Input
        placeholder="Search user by email or name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {results.length > 0 && (
        <ul className={styles.resultList}>
          {results.map((user) => (
            <li
              key={user.email}
              onClick={() => {
                onSelect(user);
                setQuery("");
                setResults([]);
              }}
            >
              {user.name} {user.surname} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
