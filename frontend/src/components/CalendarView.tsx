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
import 'temporal-polyfill/global'
import "@schedule-x/theme-default/dist/index.css"
import "./CalendarView.css"

function CalendarView() {
  const [eventsService] = useState(() => createEventsServicePlugin())
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
    const userId = localStorage.getItem("userId")
    if (!userId || !calendar) return

    fetch(`/api/tasks?userId=${userId}`)
  .then(res => res.json())
  .then(data => {
    console.log("TASKS FROM BACKEND:", data)

    data.forEach((task: any) => {
      const isAllDay = task.isAllDay

      if (isAllDay) {
        const startDate = new Date(task.startTime).toISOString().slice(0, 10)
        const endDate = new Date(task.endTime).toISOString().slice(0, 10)

        eventsService.add({
          id: String(task.id),
          title: task.name,
          description: task.description,
          start: Temporal.PlainDate.from(startDate),
          end: Temporal.PlainDate.from(endDate),
        })
      } else {
        const start = new Date(task.startTime).toISOString()
        const end = new Date(task.endTime).toISOString()

        eventsService.add({
          id: String(task.id),
          title: task.name,
          description: task.description,

          start: Temporal.ZonedDateTime.from(
            start.replace("Z", "[America/New_York]")
          ),

          end: Temporal.ZonedDateTime.from(
            end.replace("Z", "[America/New_York]")
          ),
        })
      }
    })
  })
  .catch(console.error)

  }, [calendar, eventsService])

  return <ScheduleXCalendar calendarApp={calendar} />
}

export default CalendarView