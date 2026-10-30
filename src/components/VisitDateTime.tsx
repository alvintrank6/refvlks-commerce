"use client";

import { useEffect, useState } from "react";

const slots = Array.from({ length: 27 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

export function VisitDateTime({
  today,
  last,
  dateLabel,
  timeLabel,
  choose,
  dateError,
  timeError,
}: {
  today: string;
  last: string;
  dateLabel: string;
  timeLabel: string;
  choose: string;
  dateError: string;
  timeError: string;
}) {
  const [date, setDate] = useState("");
  const [booked, setBooked] = useState<string[]>([]);
  useEffect(() => {
    if (!date) return;
    const controller = new AbortController();
    fetch(`/api/visits/slots?date=${encodeURIComponent(date)}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => setBooked((data as { booked?: string[] }).booked ?? []))
      .catch(() => {});
    return () => controller.abort();
  }, [date]);
  return (
    <div className="form-grid">
      <div className="field">
        <label htmlFor="visit-date">{dateLabel}</label>
        <input
          id="visit-date"
          name="date"
          type="date"
          min={today}
          max={last}
          required
          aria-describedby="visit-date-error"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setBooked([]);
          }}
        />
        <p className="field-error" id="visit-date-error">
          {dateError}
        </p>
      </div>
      <div className="field">
        <label htmlFor="visit-time">{timeLabel}</label>
        <select
          id="visit-time"
          name="time"
          required
          defaultValue=""
          key={date}
          aria-describedby="visit-time-error"
        >
          <option value="">{choose}</option>
          {slots.map((slot) => (
            <option key={slot} value={slot} disabled={booked.includes(slot)}>
              {slot}
              {booked.includes(slot) ? " · —" : ""}
            </option>
          ))}
        </select>
        <p className="field-error" id="visit-time-error">
          {timeError}
        </p>
      </div>
    </div>
  );
}
