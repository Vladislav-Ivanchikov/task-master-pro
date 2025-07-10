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
        <h3 className={styles.title}>{board.title}</h3>
        <p className={styles.boardDescription}>{board.description}</p>
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
        {user?.role === "ADMIN" && <UserSearch onSelect={handleSelectUser} />}
        <ul className={styles.membersList}>
          {board.members.map((member) => (
            <li key={member.user.id}>
              <DraggableMember member={member.user} isCreator={isCreator} />
              <span
                style={{ cursor: "pointer" }}
                onClick={() => handleRemoveMember(member.user)}
              >
                {isCreator && member.role === "ADMIN" ? "👑" : "x"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
