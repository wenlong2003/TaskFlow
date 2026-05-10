import { useEffect, useRef, useState } from "react";
import "./TimeModal.css";

type TimeModalProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultTime?: string;
};

function TimeModal({
  label,
  value,
  onChange,
  defaultTime = "00:00",
}: TimeModalProps) {
  const [showTimePicker, setShowTimePicker] =
    useState<boolean>(false);

  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");

  const pickerRef = useRef<HTMLDivElement | null>(null);
  const minuteRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowTimePicker(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const currentDate = value?.includes("T")
    ? value.split("T")[0]
    : "";

  // robust HH:MM extraction (prevents broken strings like "Tue, ..." leaking)
  const timeMatch = value?.match(/(\d{1,2}):(\d{2})/);
  const currentTime = timeMatch
    ? `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`
    : defaultTime;

  useEffect(() => {
    const match = currentTime.match(/(\d{2}):(\d{2})/);

    if (match) {
      setHour(match[1]);
      setMinute(match[2]);
    }
  }, [currentTime]);

  return (
    <div className="modern-date-group">
      <label className="modern-label">
        {label}
      </label>

      <div className="modern-date-time">
        <input
          className="modern-input"
          type="date"
          value={currentDate}
          onChange={(
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            onChange(
              `${e.target.value}T${currentTime}`
            );
          }}
        />

        <div
          className="custom-time-picker"
          ref={pickerRef}
        >
          <button
            type="button"
            className="time-picker-button"
            onClick={() => {
              setShowTimePicker(
                !showTimePicker
              );

              if (!showTimePicker) {
                const [h, m] =
                  currentTime.split(":");

                setHour(h || "");
                setMinute(m || "");
              }
            }}
          >
            {currentTime}
          </button>

          {showTimePicker && (
            <div className="time-modal">
              <h3>Select time</h3>

              <div className="time-grid">
                <input
                  className="time-select"
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={hour}
                  onChange={(e) => {
                    let val =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    if (val === "") {
                      setHour("");
                      return;
                    }

                    if (val.length > 2) return;

                    let num = Number(val);

                    if (num > 23) val = "23";
                    if (num < 0) val = "0";

                    setHour(val);

                    if (
                      val.length === 2 &&
                      minuteRef.current
                    ) {
                      minuteRef.current.focus();
                    }

                    onChange(
                      `${currentDate}T${val || "00"}:${minute || "00"}`
                    );
                  }}
                  onFocus={(e) =>
                    e.target.select()
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key !== "ArrowUp" &&
                      e.key !== "ArrowDown"
                    ) {
                      return;
                    }

                    e.preventDefault();

                    let current =
                      hour === ""
                        ? 0
                        : Number(hour);

                    if (e.key === "ArrowUp") {
                      current += 1;
                    }

                    if (e.key === "ArrowDown") {
                      current -= 1;
                    }

                    if (current > 23) current = 23;
                    if (current < 0) current = 0;

                    const newVal = String(
                      current
                    ).padStart(2, "0");

                    setHour(newVal);

                    onChange(
                      `${currentDate}T${newVal}:${minute || "00"}`
                    );
                  }}
                />

                <span className="time-separator">
                  :
                </span>

                <input
                  ref={minuteRef}
                  className="time-select"
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={minute}
                  onChange={(e) => {
                    let val =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    if (val === "") {
                      setMinute("");
                      return;
                    }

                    if (val.length > 2) return;

                    let num = Number(val);

                    if (num > 59) val = "59";
                    if (num < 0) val = "0";

                    setMinute(val);

                    onChange(
                      `${currentDate}T${hour || "00"}:${val || "00"}`
                    );
                  }}
                  onFocus={(e) =>
                    e.target.select()
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key !== "ArrowUp" &&
                      e.key !== "ArrowDown"
                    ) {
                      return;
                    }

                    e.preventDefault();

                    let current =
                      minute === ""
                        ? 0
                        : Number(minute);

                    if (e.key === "ArrowUp") {
                      current += 1;
                    }

                    if (e.key === "ArrowDown") {
                      current -= 1;
                    }

                    if (current > 59) current = 59;
                    if (current < 0) current = 0;

                    const newVal = String(
                      current
                    ).padStart(2, "0");

                    setMinute(newVal);

                    onChange(
                      `${currentDate}T${hour || "00"}:${newVal}`
                    );
                  }}
                />
              </div>

              <div className="time-modal-buttons">
                <button
                  type="button"
                  onClick={() =>
                    setShowTimePicker(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowTimePicker(false)
                  }
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeModal;
