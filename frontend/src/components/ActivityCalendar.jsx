import React from "react";
import { format, eachDayOfInterval, subDays } from "date-fns";
import clsx from "clsx";

const COLOR_SCALE = [
  "bg-gray-200",               // 0 activity
  "bg-green-300",               // 1
  "bg-green-500",               // 2
  "bg-green-700",            // 3
  "bg-purple-600",             // 4+
];

function getColor(count) {
  // You can tweak thresholds!
  if (count >= 4) return COLOR_SCALE[4];
  if (count >= 3) return COLOR_SCALE[3];
  if (count >= 2) return COLOR_SCALE[2];
  if (count >= 1) return COLOR_SCALE[1];
  return COLOR_SCALE[0];
}

/**
 * @param {Object[]} activityData - [{ date: "2024-07-14", count: 2 }, ...]
 * @param {number} weeks - number of weeks to show (default 15, like on LeetCode)
 */
const ActivityCalendar = ({ activityData, weeks = 30 }) => {
  // Create map for O(1) access
  const activityMap = React.useMemo(() => {
    const map = {};
    activityData.forEach(a => {
      map[a.date] = a.count;
    });
    return map;
  }, [activityData]);

  // Generate all dates (Sun-Sat columns, by week, up to "weeks")
  const today = new Date();
  const startDate = subDays(today, (weeks * 7) - 1);
  const days = eachDayOfInterval({ start: startDate, end: today });

  // Arrange days into columns (weeks), for proper grid layout
  const weeksArr = [];
  for (let i = 0; i < days.length; i += 7) {
    weeksArr.push(days.slice(i, i + 7));
  }

  return (
    <div className="p-6 bg-white/80 dark:bg-base-100/50 rounded-2xl shadow-xl border border-primary/10 overflow-x-auto w-full max-w-3xl mx-auto mb-12">
      <h2 className="text-xl font-bold mb-4 text-center text-primary">Streak Calendar</h2>
      <div className="flex gap-[3px]">
        {/* Each week is a column */}
        {weeksArr.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((date, di) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const count = activityMap[dateStr] || 0;
              return (
                <div
                  key={dateStr}
                  className={clsx(
                    "w-5 h-5 rounded-[4px] transition-all duration-300 border border-base-200 cursor-pointer",
                    getColor(count)
                  )}
                  title={`${format(date, "MMM dd, yyyy")}: ${count} problem${count===1?"":"s"} solved`}
                />
              )
            })}
          </div>
        ))}
        {/* Optional: week day labels on the left */}
        <div className="flex flex-col gap-1 ml-2 justify-between">
       {["S","M","T","W","T","F","S"].map((d, i) => (
  <span className="text-xs text-gray-400" key={d + i}>{d}</span>
))}
        </div>
      </div>
      <div className="mt-4 text-center text-xs text-gray-500 space-x-2">
        <span>No Activity</span>
        <span className="inline-block w-5 h-5 align-middle rounded-[4px] bg-gray-200 mx-1" />
        {COLOR_SCALE.slice(1).map((cls, i) => (
          <span key={cls}>
            <span className={`inline-block w-5 h-5 align-middle rounded-[4px] ${cls} mx-1`} />
            <span className="align-middle">{i + 1}{i<3?'-':''}</span>
          </span>
        ))}
        <span className="ml-2">4+</span>
      </div>
    </div>
  );
};

export default ActivityCalendar;
