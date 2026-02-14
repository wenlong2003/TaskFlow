import type { Task } from "../hooks/useTasks";

type Props = {
  tasks: Task[];
};

export default function TaskList({ tasks }: Props) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.name} {task.dueDate ? `- Due: ${task.dueDate}` : ""}
        </li>
      ))}
    </ul>
  );
}