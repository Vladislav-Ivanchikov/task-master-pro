import { useEffect, useState } from "react";
import { useAuth } from "@app/context/AuthContext.js";
import { BoardMember } from "@appTypes/BoardMember.js";
import { findUsers } from "@features/board-members/api/findUserService.js";
import { Input } from "@taskmaster/ui-kit";
import styles from "./UserSearch.module.css";

type UserSearchProps = {
  onSelect: (user: BoardMember) => void;
};

const UserSearch = ({ onSelect }: UserSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const data = await findUsers(query, token);
        setResults(data);
      } catch (err) {
        console.error("User search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

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
