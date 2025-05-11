import { Button } from "@taskmaster/ui-kit";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleSidebar } from "../store/features/ui/uiSlice";

const DashbordPage = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  return (
    <div>
      <h2>Dashboard</h2>
      <Button onClick={() => dispatch(toggleSidebar())}>
        {isOpen ? "Закрыть меню" : "Открыть меню"}
      </Button>
    </div>
  );
};

export default DashbordPage;
