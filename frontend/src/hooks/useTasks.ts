import { useState, useEffect } from "react";

export type Task = {
  id: number;
  name: string;
  done: boolean;
  createAt: string;
  dueDate: string | null;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch all tasks from Flask API
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/tasks");
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  // Add a new task
  const addTask = async (name: string, dueDate: string | null = null) => {
    try {
      await fetch("http://127.0.0.1:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dueDate }),
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, fetchTasks, addTask };
}