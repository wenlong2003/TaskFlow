import "./EventList.css";

type Event = {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
};

type Props = {
  events: Event[];
  onDelete?: (id: number) => void;
  onEdit?: (event: Event) => void;
};

const formatDisplay = (value: string) => {
  if (!value) return "";

  const date = new Date(value.replace(" ", "T"));

  if (isNaN(date.getTime())) return value;

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function EventList({ events, onDelete, onEdit }: Props) {
  return (
    <div className="event-list">
      {events.length === 0 ? (
        <p>No events scheduled</p>
      ) : (
        [...events]
          .filter((event) => {
            const end = new Date(event.endTime || "");
            return !isNaN(end.getTime()) && end.getTime() >= Date.now();
          })
          .sort((a, b) => {
            const aTime = new Date(a.startTime || "").getTime();
            const bTime = new Date(b.startTime || "").getTime();

            return aTime - bTime;
          })
          .map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-actions">
                <button
                  className="edit-btn"
                  title="Edit"
                  onClick={() => onEdit?.(event)}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="delete-btn"
                  title="Delete"
                  onClick={() => {
                    if (!onDelete) return;

                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this event?"
                    );

                    if (confirmDelete) {
                      onDelete(event.id);
                    }
                  }}
                >
                <i className="bi bi-trash3"></i>
                </button>
              </div>
              <strong>{event.name}</strong>

              <p>{event.description}</p>

              <small>
                {formatDisplay(event.startTime)} - {formatDisplay(event.endTime)}
              </small>
            </div>
          ))
      )}
    </div>
  );
}

export default EventList;