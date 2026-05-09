import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";
import TimeModal from "../components/TimeModal";
import EventList from "../components/EventList";
import { fetchEvents, createEvent } from "../utils/eventApi";

function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [events, setEvents] = useState<any[]>([]);
  const [isFullDay, setIsFullDay] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const handleCreateEvent = async (allDay: boolean) => {
    if (!token) {
      alert("You are not authenticated.");
      return;
    }

    if (!title) {
      alert("Please enter a title.");
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

        payload.startTime = `${dateOnly} 00:00:00`;
        payload.endTime = `${dateOnly} 23:59:59`;
      } else {
        if (!startTime || !endTime) {
          alert("Please fill all required fields.");
          setLoading(false);
          return;
        }

        payload.startTime = new Date(startTime).toISOString();
        payload.endTime = new Date(endTime).toISOString();
      }

      if (editingEvent) {
        await fetch(`/api/tasks/${editingEvent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        alert("Event updated!");
      } else {
        await createEvent(token, payload);

        alert("Event created!");
      }

      setEditingEvent(null);

      fetchEvents(token)
        .then(setEvents)
        .catch(console.error);

      setTitle("");
      setDescription("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error(err);
      alert("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchEvents(token)
      .then(setEvents)
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    if (!editingEvent) return;

    setTitle(editingEvent.name || "");
    setDescription(editingEvent.description || "");
    setStartTime(editingEvent.startTime || "");
    setEndTime(editingEvent.endTime || "");
    setIsFullDay(editingEvent.isAllDay || false);
  }, [editingEvent]);

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchEvents(token)
        .then(setEvents)
        .catch(console.error);

    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };

  return (
    <main className="dashboard-container">

      {/* LEFT SIDE */}
      <div className="content-left">

        {/* CREATE EVENT */}
        <section className="modern-create-container">

          <h1 className="modern-dashboard-title">
            Create Event
          </h1>

          <form
            className="modern-event-form"
            onSubmit={(
              e: React.FormEvent<HTMLFormElement>
            ) => e.preventDefault()}
          >

            {/* TITLE */}
            <div className="modern-create-section">
              <div className="modern-field">
                <label className="modern-label">
                  Title
                </label>

                <input
                  className="modern-input"
                  type="text"
                  value={title}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="modern-create-section">
              <div className="modern-field">
                <label className="modern-label">
                  Description
                </label>

                <textarea
                  className="modern-input modern-textarea"
                  value={description}
                  onChange={(
                    e: React.ChangeEvent<HTMLTextAreaElement>
                  ) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* DATE + TIME */}
            <div className="modern-create-section">
              <div className="modern-datetime-container">
                <div className="modern-datetime-row">

                  <TimeModal
                    label="Start date"
                    value={startTime}
                    onChange={setStartTime}
                    defaultTime="18:00"
                  />

                  <span className="modern-until">until</span>

                  <TimeModal
                    label="End date"
                    value={endTime}
                    onChange={setEndTime}
                    defaultTime="19:00"
                  />

                </div>
              </div>
            </div>

            {/* FULL DAY */}
            <div className="modern-create-section">
              <div className="modern-checkbox-row">
                <input
                  className="modern-checkbox"
                  type="checkbox"
                  id="fullDay"
                  checked={isFullDay}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setIsFullDay(e.target.checked)
                  }
                />
                <label htmlFor="fullDay">
                  Full-day event
                </label>
              </div>
            </div>

            

            {/* BUTTONS */}
            <div className="modern-button-row">

              <button
                className="modern-save-btn"
                type="button"
                disabled={loading}
                onClick={() => handleCreateEvent(isFullDay)}
              >
                {loading
                  ? (editingEvent ? "Saving..." : "Creating...")
                  : (editingEvent ? "Save" : "Create")}
              </button>

            </div>
          </form>
        </section>
      </div>

      {/* RIGHT SIDE */}
      <section className="container-events">

        <h2 className="dashboard-title">
          Upcoming Events
        </h2>

        <EventList
          events={events}
          onDelete={handleDelete}
          onEdit={setEditingEvent}
        />
      </section>
    </main>
  );
}

export default Dashboard;