import { Radio } from "@taskmaster/ui-kit";
import { TaskStatus } from "@appTypes/Task.js";

type StatusSelectorProps = {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
};

const StatusSelector = ({ value, onChange }: StatusSelectorProps) => {
  const options: { value: TaskStatus; label: string }[] = [
    { value: TaskStatus.TODO, label: "ToDo" },
    { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
    { value: TaskStatus.DONE, label: "Done" },
  ];

  return (
    <div className="ratio">
      <p>Choose status</p>
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name="status"
          value={opt.value}
          label={opt.label}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
        />
      ))}
    </div>
  );
};

export default StatusSelector;
