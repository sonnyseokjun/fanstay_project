import type { CSSProperties } from 'react'
import type { Content } from '../content/types'

// 히어로 일러스트: 한 달 체류를 달력 한 장으로 보여 준다.
// 체크인부터 체크아웃까지 형광펜이 날짜 순서대로 칠해지는 것이 페이지의 유일한 자동 애니메이션이다.

type Calendar = Content['hero']['calendar']

export function StayCalendar({ calendar }: { calendar: Calendar }) {
  const { year, month, notes } = calendar
  const daysInMonth = new Date(year, month, 0).getDate()
  const leading = new Date(year, month - 1, 1).getDay() // 1일의 요일 (0=일)
  const stayEnd = Math.max(...notes.map((n) => n.day))
  const noteByDay = new Map(notes.map((n) => [n.day, n]))

  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <figure className="calendar" aria-label={calendar.alt}>
      <figcaption className="calendar__head" aria-hidden="true">
        <span className="calendar__month">
          {year}년 {month}월
        </span>
        <span className="calendar__city">{calendar.city}</span>
        <span className="calendar__legend">
          <span className="calendar__swatch" />
          {calendar.legend}
        </span>
      </figcaption>
      <div className="calendar__grid" aria-hidden="true">
        {calendar.weekdays.map((w) => (
          <span key={w} className="calendar__weekday">
            {w}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} className="calendar__cell calendar__cell--empty" />
          const staying = day <= stayEnd
          const note = noteByDay.get(day)
          const col = i % 7
          return (
            <span
              key={day}
              className={[
                'calendar__cell',
                staying && 'is-stay',
                staying && (col === 0 || day === 1) && 'is-stay-start',
                staying && (col === 6 || day === stayEnd) && 'is-stay-end',
                note && 'has-note',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ '--d': day } as CSSProperties}
            >
              <span className="calendar__date">{day}</span>
              {note && (
                <span className="calendar__note">
                  <span className="calendar__note-long">{note.label}</span>
                  <span className="calendar__note-short">{note.short}</span>
                </span>
              )}
            </span>
          )
        })}
      </div>
    </figure>
  )
}
