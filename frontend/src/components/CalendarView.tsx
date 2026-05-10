import "temporal-polyfill/global"
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { useEffect, useState } from 'react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import "@schedule-x/theme-default/dist/index.css"
import "./CalendarView.css"
import { useAuth } from "../context/AuthContext"

function CalendarView() {
  const [eventsService] = useState(() => createEventsServicePlugin())
  const { token } = useAuth()
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda()
    ],
    events: [],
    plugins: [eventsService, createEventModalPlugin()]
  })

  useEffect(() => {
    if (!calendar) return
    if (!token) return

    fetch(`/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("TASKS FROM BACKEND:", data)
        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data)
          return
        }

        // Schedule-X-compatible version: add events directly to eventsService
        data.forEach((task: any) => {
          const isAllDay = task.isAllDay

          if (isAllDay) {
            const startDate = task.startTime?.slice(0, 10)
            const endDate = task.endTime?.slice(0, 10)

            eventsService.add({
              id: String(task.id),
              title: task.name,
              description: task.description,
              start: Temporal.PlainDate.from(startDate),
              end: Temporal.PlainDate.from(endDate),
            })
          } else {
            // Safely parse backend datetime (handles RFC, ISO, or string formats)
            const startInstant = Temporal.Instant.from(new Date(task.startTime).toISOString())
            const endInstant = Temporal.Instant.from(new Date(task.endTime).toISOString())

            const startZoned = startInstant.toZonedDateTimeISO("America/New_York")
            const endZoned = endInstant.toZonedDateTimeISO("America/New_York")

            eventsService.add({
              id: String(task.id),
              title: task.name,
              description: task.description,
              start: startZoned,
              end: endZoned,
            })
          }
        })
      })
      .catch(console.error)
  }, [calendar, eventsService, token])

  useEffect(() => {
    if (token) return

    if (eventsService?.getAll && eventsService?.remove) {
      const allEvents = eventsService.getAll()
      allEvents.forEach((event: any) => {
        eventsService.remove(event.id)
      })
    }
  }, [token, eventsService])

  return (
    <div className="calendar-wrapper">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}

export default CalendarView