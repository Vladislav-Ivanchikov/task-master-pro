import { User } from "@appTypes/User.js";
import { Board } from "@appTypes/Board.js";
import { Button } from "@taskmaster/ui-kit";
import DraggableMember from "@features/board-members/ui/DraggableMember.js";
import UserSearch from "@features/board-members/ui/UserSearch/UserSearch.js";
import styles from "@pages/BoardPage/BoardPage.module.css";

type SidebarProps = {
  board: Board | null;
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
        <h3 className={styles.title}>{board?.title}</h3>
        <p className={styles.boardDescription}>{board?.description}</p>
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
          {board?.members.map((member) => (
            <li key={member.user.id}>
              <DraggableMember member={member.user} isCreator={isCreator} />
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (isCreator && member.role !== "ADMIN") {
                    handleRemoveMember(member.user);
                  }
                }}
              >
                {member.role === "ADMIN" && "👑"}
                {isCreator && member.role !== "ADMIN" && "x"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
