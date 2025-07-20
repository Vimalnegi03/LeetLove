import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import ProblemsTable from "../components/ProblemsTable";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { subDays, format } from "date-fns";
import ActivityCalendar from "../components/ActivityCalendar";
import ClockTimer from "../components/ClockTimerComponent";

const HomePage = () => {
  const {
    getAllProblem,
    problems,
    isProblemsLoading,
    solvedProblems,
    getSolvedProblemsByUser,
  } = useProblemStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllProblem();
    // Consider: if (authUser?.userId) getSolvedProblemsByUser();
    // eslint-disable-next-line
  }, [getAllProblem, authUser?.userId, solvedProblems, getSolvedProblemsByUser]);

  // Memoized activity data for calendar
  const activityData = React.useMemo(() => {
    const counts = {};
    problems?.forEach((prob) => {
      prob.solvedBy?.forEach((solve) => {
        if (solve.userId === authUser?.userId && solve.updatedAt) {
          const day = format(new Date(solve.updatedAt), "yyyy-MM-dd");
          counts[day] = (counts[day] || 0) + 1;
        }
      });
    });
    const today = new Date();
    const N = 30 * 7; // 30 weeks
    const days = [];
    for (let i = N - 1; i >= 0; i--) {
      const dateStr = format(subDays(today, i), "yyyy-MM-dd");
      days.push({ date: dateStr, count: counts[dateStr] || 0 });
    }
    return days;
  }, [problems, authUser?.userId]);

  return (
    <section className="min-h-screen relative flex flex-col items-center bg-gradient-to-br from-blue-300 via-fuchsia-50 to-blue-50 dark:from-[#181824] dark:to-[#27293d] overflow-x-hidden px-2">
      {/* Animated Blob */}
      <div className="pointer-events-none select-none absolute -top-24 -left-24 md:-top-32 md:-left-32 w-[70vw] md:w-[40vw] h-[70vw] md:h-[40vw] bg-primary/30 blur-3xl rounded-full animate-pulse z-0"></div>

      {/* Welcome Hero Card */}
      <div className="z-10 w-full max-w-3xl mt-16 sm:mt-24 px-2 sm:px-4 md:px-6 lg:px-10 py-7 sm:py-11 rounded-2xl shadow-[0_6px_60px_-10px_rgba(120,58,255,0.20)] bg-white/80 dark:bg-[#181824]/80 backdrop-blur-[2px] flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-fuchsia-600 via-blue-700 to-indigo-400 bg-clip-text text-transparent animate-gradient tracking-tight leading-tight drop-shadow-xl">
          Welcome to <span className="drop-shadow text-fuchsia-800 dark:text-fuchsia-300">LeetLove</span>
        </h1>
        <p className="mt-5 sm:mt-7 mb-2 sm:mb-3 text-center text-base sm:text-lg md:text-xl font-medium text-gray-700 dark:text-gray-100 max-w-lg sm:max-w-2xl">
          A platform inspired by <span className="font-bold text-primary">LeetCode</span> to help you prepare for coding interviews and boost your coding skills by solving hands-on coding problems.
        </p>
      </div>

      {/* Timer & Activity Calendar Section */}
      <div className="z-10 w-full flex flex-col items-center gap-1">
        <div className="w-full max-w-3xl -mb-1 mt-5 sm:mt-7">
          <div className="rounded-xl p-0 flex flex-col items-center">
            <ClockTimer />
            <div className="w-full overflow-x-auto">
              <ActivityCalendar activityData={activityData} />
            </div>
          </div>
        </div>
      </div>

      {/* Start Solving Button */}
      <div className="z-10 w-full max-w-3xl flex justify-center mb-8 mt-2">
        <Link
          to="#problems"
          className="btn btn-primary shadow-xl rounded-full w-full sm:w-auto px-6 sm:px-10 py-2 text-lg font-bold hover:scale-105 active:scale-95 duration-150 transition text-center"
        >
          Start Solving
        </Link>
      </div>

      {/* Loader or ProblemsTable */}
      <div id="problems" className="w-full flex justify-center z-10">
        <div className="w-full max-w-6xl">
          {isProblemsLoading ? (
            <div className="flex items-center justify-center h-60 sm:h-96">
              <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : problems.length > 0 ? (
            <div className="flex flex-col w-full">
              <ProblemsTable problems={problems} />
            </div>
          ) : (
            <p className="mt-10 text-center text-base sm:text-lg font-semibold text-gray-500 dark:text-gray-400 border border-primary px-4 py-2 rounded-md border-dashed">
              No problems found
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
