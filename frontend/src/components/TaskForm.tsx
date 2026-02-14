import { useState } from "react";

type Props = {
  onAddTask: (name: string, dueDate: string) => void;
};

export default function TaskForm({ onAddTask }: Props) {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!name) return alert("Task name required");

  onAddTask(name, dueDate);
  setName("");
  setDueDate("");
};

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}