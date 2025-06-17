// components/DraggableMember.tsx
import { useDrag } from "react-dnd";
import { BoardMember } from "../../../../../packages/types/BoardMember";
import { useEffect, useRef } from "react";

interface Props {
  member: BoardMember;
  isCreator: boolean;
}

const DraggableMember = ({ member, isCreator }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: "BOARD_MEMBER",

    item: { userId: member.user.id },
    canDrag: () => isCreator,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (ref.current) drag(ref.current);
  }, [ref, drag]);

  return (
    <div
      draggable={isCreator}
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        padding: "4px 8px",
      }}
    >
      {member.user.name + " " + member.user.surname} ({member.user.email})
    </div>
  );
};

export default DraggableMember;
