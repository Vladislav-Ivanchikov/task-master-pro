import { BoardMember } from "@appTypes/BoardMember.js";
import { API_URL } from "@app/const.js";

export const findUsers = async (
  query: string,
  token: string | null
): Promise<BoardMember[]> => {
  if (query.length < 2) return [];

  const response = await fetch(`${API_URL}/api/users/search?query=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to search users");
  }

  const result: BoardMember[] = await response.json();
  return Array.isArray(result) ? result : [];
};
