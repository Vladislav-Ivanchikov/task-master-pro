import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchBoards,
  removeBoard,
} from "../../store/features/slices/boardsSlice";
import { useAuth } from "../../context/AuthContext";
import CreateBoardModal from "../../components/BoardModal/CreateBoardModal";
import { BoardList } from "../../components/BoardList/BoardList";
import { Button, useToast, Loader } from "@taskmaster/ui-kit";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const { token } = useAuth();
  const { boards, loading, error } = useAppSelector((state) => state.boards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  const deleteBoard = async (id: string) => {
    try {
      const data = await dispatch(removeBoard(id)).unwrap();
      showToast({ type: "success", message: data && data.message });
    } catch (err: any) {
      console.error("Error deleting board", err);
      showToast({ type: "error", message: err || "Failed to delete board" });
    }
  };

  if (loading) {
    return <Loader size="lg" />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return boards.length === 0 ? (
    <div>
      <h2>Dashboard</h2>
      <Button onClick={() => setIsModalOpen(true)}>Add First Board</Button>
      {isModalOpen && (
        <CreateBoardModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchBoards}
        />
      )}
    </div>
  ) : (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Dashboard</h2>
          <p className={styles.subtitle}>
            Welcome to your task management dashboard!
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Create Board</Button>
      </div>
      <BoardList boards={boards} deleteBoard={deleteBoard} />
      {isModalOpen && (
        <CreateBoardModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchBoards}
        />
      )}
    </div>
  );
};

export default DashboardPage;
