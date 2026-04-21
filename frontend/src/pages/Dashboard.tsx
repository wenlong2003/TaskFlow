import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);

  const formatDateTime = (value: string) => {
    return value.replace("T", " ") + ":00";
  };

  const handleCreateEvent = async (allDay: boolean) => {
    if (!token) {
      alert("You are not authenticated. Please log in again.");
      return;
    }

    if (!title) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      let payload: any = {
        name: title,
        description,
        isAllDay: allDay,
      };

      if (allDay) {
        const dateOnly = startTime.split("T")[0];

        payload.startTime = dateOnly + " 00:00:00";
        payload.endTime = dateOnly + " 23:59:59";
      } else {
        if (!startTime || !endTime) {
          alert("Please fill all required fields");
          setLoading(false);
          return;
        }

        payload.startTime = formatDateTime(startTime);
        payload.endTime = formatDateTime(endTime);
      }

      await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      alert("Event created! Go to calendar to see it.");

      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Create Event</h1>

      <form className="event-form">
        <input
          className="input"
          type="text"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Start Time</label>
        <input
          className="input"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <label>End Time</label>
        <input
          className="input"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="create-event-btn"
            type="button"
            disabled={loading}
            onClick={() => handleCreateEvent(false)}
          >
            {loading ? "Creating..." : "Timed Event"}
          </button>

          <button
            className="create-event-btn"
            type="button"
            disabled={loading}
            onClick={() => handleCreateEvent(true)}
          >
            {loading ? "Creating..." : "All Day Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Dashboard;