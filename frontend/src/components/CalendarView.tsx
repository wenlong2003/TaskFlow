import "temporal-polyfill/global"
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { useEffect, useState } from 'react'
import type { CalendarEventExternal } from '@schedule-x/calendar'
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
    locale: 'en-GB',
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

        const formattedEvents: CalendarEventExternal[] = data.map((task: any) => {
          const startDate = new Date(task.startTime)
          const endDate = new Date(task.endTime)

          const start = Temporal.Instant.fromEpochMilliseconds(startDate.getTime())
            .toZonedDateTimeISO(Temporal.Now.timeZoneId())

          const end = Temporal.Instant.fromEpochMilliseconds(endDate.getTime())
            .toZonedDateTimeISO(Temporal.Now.timeZoneId())

          return {
            id: String(task.id),
            title: task.name,
            description: task.description,
            start,
            end,
          }
        })

        eventsService.set(formattedEvents)
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