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
};

function EventList({ events }: Props) {
  return (
    <div className="event-list">
      {events.length === 0 ? (
        <p>No events scheduled</p>
      ) : (
        [...events]
          .sort(
            (a, b) =>
              new Date(a.startTime).getTime() -
              new Date(b.startTime).getTime()
          )
          .map((event) => (
            <div key={event.id} className="event-card">
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