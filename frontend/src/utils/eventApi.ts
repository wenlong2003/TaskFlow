export const formatDateTime = (value: string): string => {
  return value.replace("T", " ") + ":00";
};

export const fetchEvents = async (token: string) => {
  const res = await fetch("/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
};

export const createEvent = async (
  token: string,
  payload: any
) => {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create event");
  }

  return res.json();
};