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

function EventList({ events, onDelete, onEdit }: Props) {
  return (
    <div className="event-list">
      {events.length === 0 ? (
        <p>No events scheduled</p>
      ) : (
        [...events]
          .filter((event) => new Date(event.endTime).getTime() >= Date.now())
          .sort(
            (a, b) =>
              new Date(a.startTime).getTime() -
              new Date(b.startTime).getTime()
          )
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
                {event.startTime} - {event.endTime}
              </small>
            </div>
          ))
      )}
    </div>
  );
}

export default EventList;