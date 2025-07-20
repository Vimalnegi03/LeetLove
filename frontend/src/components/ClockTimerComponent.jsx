import React, { useState, useEffect } from "react";

const ClockTimer = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // format as HH:mm:ss or customize as needed
  const timeString = now
    .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="flex items-center justify-center gap-2 mb-2 text-md font-bold text-blue-700">
      <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full shadow">{timeString}</span>
    </div>
  );
};

export default ClockTimer;
