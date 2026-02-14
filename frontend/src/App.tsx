import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTasks } from "./hooks/useTasks";
import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { Toggle } from "./components/toggle";
import "./App.css";

function SignIn() {
  return <h2>Sign In Page (to be implemented)</h2>
}

function SignUp() {
  return <h2>Sign Up Page (to be implemented)</h2>
}

function Dashboard() {
  const { tasks, addTask} = useTasks();

  return (
    <div>
      <h1>Task Tracker</h1>
      <TaskForm onAddTask={addTask}></TaskForm>
      <TaskList tasks={tasks}></TaskList>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
  }

  return (
    <BrowserRouter>
    <div data-theme={isDark ? "dark" : "light"}>
    <Toggle isChecked={isDark}handleChange={() => setIsDark(!isDark)}></Toggle>
    <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout}></Navbar>

    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;

