import type { Priority } from "../types/ticket";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`badge priority-badge priority-badge--${priority.toLowerCase()}`}>
      {priorityLabels[priority]}
    </span>
  );
}

export default PriorityBadge;
