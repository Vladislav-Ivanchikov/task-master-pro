import { useDrag } from "react-dnd";
import { useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { User } from "../../../../../packages/types/User";

interface Props {
  member: User;
  isCreator: boolean;
}

const DraggableMember = ({ member, isCreator }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "BOARD_MEMBER",
    canDrag: () => isCreator,

    item: () => ({
      userId: member.id,
      dragId: nanoid(),
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (ref.current) drag(ref.current);
  }, [ref, drag]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        padding: "4px 8px",
      }}
    >
      {member.name + " " + member.surname} ({member.email})
    </div>
  );
};

export default DraggableMember;
