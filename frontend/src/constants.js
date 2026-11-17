export const STATUSES = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const PRIORITIES = [
  { value: "low", label: "Baixa", className: "bg-primary-50 text-primary-700" },
  { value: "medium", label: "Média", className: "bg-warning/15 text-warning" },
  { value: "high", label: "Alta", className: "bg-danger/10 text-danger" },
];

export const priorityMeta = (value) =>
  PRIORITIES.find((p) => p.value === value);
