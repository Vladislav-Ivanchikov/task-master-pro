import { useAppDispatch, useAppSelector } from "../store/features/hooks.js";
import {
  addBoardMemberThunk,
  removeBoardMemberThunk,
} from "../store/thunks/boardMembersThunks.js";
import { User } from "../../../../packages/types/User.js";
import { useToast } from "@taskmaster/ui-kit";

export const useBoardMembers = () => {
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.boards.selectedBoard);
  const { showToast } = useToast();

  const addMember = async (user: User) => {
    if (!board) {
      showToast({ message: "No board selected", type: "error" });
      return;
    }

    const alreadyExists =
      Array.isArray(board.members) &&
      board.members.some((m) => m.user?.email === user.email);

    if (alreadyExists) {
      showToast({ message: "User already assigned to board", type: "error" });
      return;
    }

    try {
      await dispatch(addBoardMemberThunk({ boardId: board.id, user })).unwrap();
      showToast({
        message: `User ${user.email} added successfully`,
        type: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error adding member";
      showToast({ message, type: "error" });
    }
  };

  const removeMember = async (userId: string, name: string) => {
    if (!board) {
      showToast({ message: "No board selected", type: "error" });
      return;
    }

    try {
      await dispatch(
        removeBoardMemberThunk({ boardId: board.id, userId })
      ).unwrap();
      showToast({
        message: `User ${name} removed successfully`,
        type: "success",
      });
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err instanceof Error
            ? err.message
            : "Error removing member";

      showToast({ message, type: "error" });
    }
  };

  return { addMember, removeMember };
};
