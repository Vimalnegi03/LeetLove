import React from "react";
import { format, eachDayOfInterval, subDays } from "date-fns";
import clsx from "clsx";

const COLOR_SCALE = [
  "bg-gray-200",        // 0 activity
  "bg-green-300",       // 1
  "bg-green-500",       // 2
  "bg-green-700",       // 3
  "bg-purple-600",      // 4+
];

function getColor(count) {
  if (count >= 4) return COLOR_SCALE[4];
  if (count >= 3) return COLOR_SCALE[3];
  if (count >= 2) return COLOR_SCALE[2];
  if (count >= 1) return COLOR_SCALE[1];
  return COLOR_SCALE[0];
}

/**
 * @param {Object[]} activityData - [{ date: "2024-07-14", count: 2 }, ...]
 * @param {number} weeks - number of weeks to show (default 30)
 */
const ActivityCalendar = ({ activityData, weeks = 30 }) => {
  const activityMap = React.useMemo(() => {
    const map = {};
    activityData.forEach(a => {
      map[a.date] = a.count;
    });
    return map;
  }, [activityData]);

  // Dates layout logic
  const today = new Date();
  const startDate = subDays(today, (weeks * 7) - 1);
  const days = eachDayOfInterval({ start: startDate, end: today });

  // Split into weeks
  const weeksArr = [];
  for (let i = 0; i < days.length; i += 7) {
    weeksArr.push(days.slice(i, i + 7));
  }

  return (
    <div className="p-4 sm:p-6 bg-white/80 dark:bg-base-100/50 rounded-2xl shadow-xl border border-primary/10
      w-full max-w-full sm:max-w-3xl mx-auto mb-8 sm:mb-12 
      overflow-x-auto scrollbar-thin"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-center text-primary">
        Streak Calendar
      </h2>
      {/* Responsive grid with scroll */}
      <div className="flex items-start gap-[2px] sm:gap-[3px] min-w-max pr-4">
        {/* Calendar */}
        {weeksArr.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[2px] sm:gap-[3px]">
            {week.map((date, di) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const count = activityMap[dateStr] || 0;
              return (
                <div
                  key={dateStr}
                  className={clsx(
                    // w-4 min on mobile, w-5 on desktop
                    "w-4 h-4 sm:w-5 sm:h-5 min-w-[1rem] min-h-[1rem] rounded-[4px] transition-all duration-300 border border-base-200 cursor-pointer",
                    getColor(count)
                  )}
                  title={`${format(date, "MMM dd, yyyy")}: ${count} problem${count === 1 ? "" : "s"} solved`}
                />
              );
            })}
          </div>
        ))}

        {/* Weekday labels, left-aligned, always visible */}
        <div className="flex flex-col gap-0.5 sm:gap-1 ml-1 sm:ml-2 justify-between h-full min-w-[15px]">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span className="text-[9px] sm:text-xs text-gray-400 leading-snug" key={d + i}>
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 sm:mt-4 text-[9px] sm:text-xs text-center text-gray-500 flex flex-wrap items-center justify-center gap-2">
        <span className="whitespace-nowrap">No Activity</span>
        <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 align-middle rounded-[4px] bg-gray-200 mx-1" />
        {COLOR_SCALE.slice(1).map((cls, i) => (
          <span key={cls} className="flex items-center gap-1">
            <span className={`inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-[4px] ${cls}`} />
            <span>{i + 1}{i < 3 ? '-' : ''}</span>
          </span>
        ))}
        <span className="ml-1">4+</span>
      </div>
    </div>
  );
};

export default ActivityCalendar;
