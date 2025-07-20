import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore";
import ProblemsTable from "../components/ProblemsTable";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const HomePage = () => {
  const { getAllProblem, problems, isProblemsLoading,solvedProblems, getSolvedProblemsByUser } = useProblemStore();
   const { authUser } = useAuthStore();
  useEffect(() => {
    
    getAllProblem();
  }, [getAllProblem]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-rose-50 to-purple-100 dark:from-[#181824] dark:to-[#27293d] flex flex-col items-center px-4 relative overflow-hidden">
      {/* Animated blob */}
      <div className="absolute left-[-10vw] top-[-10vw] w-[34vw] h-[34vw] bg-primary/40 blur-3xl rounded-full animate-pulse z-0" />

      <div className="z-10 w-full max-w-3xl mt-24 mb-14 px-8 py-10 rounded-2xl bg-white/80 dark:bg-black/50 shadow-2xl backdrop-blur-md flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-fuchsia-600 via-blue-600 to-indigo-400 bg-clip-text text-transparent animate-gradient">
          Welcome to <span className="drop-shadow-lg">LeetLove</span>
        </h1>
        <p className="mt-5 text-center text-xl font-medium text-gray-600 dark:text-gray-300">
          A platform inspired by <span className="font-bold text-primary">LeetCode</span> to help you prepare for coding interviews and boost your coding skills by solving hands-on coding problems.
        </p>
        <Link
          to="#problems"
          className="btn btn-primary mt-8 shadow-md rounded-full px-8 py-2 text-lg font-bold hover:-translate-y-1 hover:shadow-xl transition"
        >
          Start Solving
        </Link>
      </div>

      {/* Loader or ProblemsTable */}
      <div id="problems" className="w-full">
        {isProblemsLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader className="size-10 animate-spin text-primary" />
          </div>
        ) : (
          problems.length > 0 ? <ProblemsTable problems={problems} /> : (
            <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
              No problems found
            </p>
          )
        )}
      </div>
    </section>
  );
};
export default HomePage;
