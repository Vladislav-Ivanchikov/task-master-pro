import DraggableMember from "../../components/DraggableMember/DraggableMember";
import UserSearch from "../../components/UserSearch/UserSearch";
import { User } from "../../../../../packages/types/User";
import { Board } from "../../../../../packages/types/Board";
import { Button } from "@taskmaster/ui-kit";
import styles from "../../pages/BoardPage/BoardPage.module.css";

type SidebarProps = {
  board: Board;
  isCreator: boolean;
  user: User | null | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
  handleSelectUser: (user: User) => void;
  handleRemoveMember: (user: User) => void;
};

const Sidebar = ({
  board,
  isCreator,
  user,
  setIsModalOpen,
  handleSelectUser,
  handleRemoveMember,
}: SidebarProps) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3>{board.title}</h3>

        {isCreator && (
          <Button
            onClick={() => setIsModalOpen && setIsModalOpen(true)}
            className={styles.button}
          >
            Add New Task
          </Button>
        )}
      </div>

      <div className={styles.boardMembers}>
        <h4>{board.title} members:</h4>
        {user?.role === "ADMIN" && <UserSearch onSelect={handleSelectUser} />}
        <ul>
          {board.members.map((member) => (
            <li key={member.user.id}>
              <DraggableMember member={member.user} isCreator={isCreator} />
              <span
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveMember(member.user)}
              >
                {"x"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
