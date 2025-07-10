import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addBoardMemberThunk,
  removeBoardMemberThunk,
} from "../store/features/slices/boardMembersSlice";
import { User } from "../../../../packages/types/User";
import { useToast } from "@taskmaster/ui-kit";

export const useBoardMembers = (boardId: string) => {
  const dispatch = useAppDispatch();
  const { board } = useAppSelector((state) => state.board);
  const { showToast } = useToast();

  const addMember = async (user: User) => {
    if (board.members.some((m) => m.user.email === user.email)) {
      showToast({ message: "User already assigned to board", type: "error" });
      return;
    }

    const result = await dispatch(addBoardMemberThunk({ boardId, user }));
    if (addBoardMemberThunk.rejected.match(result)) {
      showToast({
        message: result.payload || "Error adding member",
        type: "error",
      });
    } else {
      showToast({
        message: `User ${user.email} added successfully`,
        type: "success",
      });
    }
  };

  const removeMember = async (userId: string, name: string) => {
    const result = await dispatch(removeBoardMemberThunk({ boardId, userId }));
    if (removeBoardMemberThunk.rejected.match(result)) {
      showToast({
        message: result.payload || "Error removing member",
        type: "error",
      });
    } else {
      showToast({
        message: `User ${name} removed successfully`,
        type: "success",
      });
    }
  };

  return { addMember, removeMember };
};
