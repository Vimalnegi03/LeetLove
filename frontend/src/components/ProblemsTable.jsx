import React, { useState, useMemo,useEffect, useRef} from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, TrashIcon, Plus } from "lucide-react";
import { useActions } from "../store/useAction";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";
import clsx from "clsx";
import { useProblemStore } from "../store/useProblemStore";
const badgeColors = {
  EASY: "bg-emerald-100 text-emerald-700 border-emerald-300",
  MEDIUM: "bg-amber-100 text-yellow-800 border-amber-300",
  HARD: "bg-rose-200 text-rose-800 border-rose-300"
};

const ProblemsTable = ({ problems }) => {
    console.log(problems);
    
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const { createPlaylist } = usePlaylistStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
const { solvedProblems, getSolvedProblemsByUser } = useProblemStore();

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  // Filtering
  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) =>
        difficulty === "ALL" ? true : p.difficulty === difficulty)
      .filter((p) =>
        selectedTag === "ALL" ? true : p.tags?.includes(selectedTag));
  }, [problems, search, difficulty, selectedTag]);

  const itemsPerPage = 7;
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / itemsPerPage));
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage, itemsPerPage]);

  // Handlers
  const handleDelete = (id) => onDeleteProblem(id);
  const handleCreatePlaylist = async (data) => await createPlaylist(data);
  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  // Pagination bullets for modern look
  const renderPagination = () => (
    <div className="flex flex-wrap justify-center gap-3 my-7">
      <button
        className={clsx("btn btn-sm", currentPage === 1 && "btn-disabled")}
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >Prev</button>
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          className={clsx(
            "w-3 h-3 rounded-full mx-1",
            idx + 1 === currentPage
              ? "bg-primary shadow-outline animate-scaleOut"
              : "bg-primary/20"
          )}
          onClick={() => setCurrentPage(idx + 1)}
          aria-label={`Page ${idx + 1}`}
        />
      ))}
      <button
        className={clsx("btn btn-sm", currentPage === totalPages && "btn-disabled")}
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >Next</button>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 mb-14"
      style={{ scrollMarginTop: "120px" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Problems</h2>
        <button
          className="btn btn-primary gap-2 shadow transition hover:-translate-y-1"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4" /> Create Playlist
        </button>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 justify-between mb-7">
        <input
          type="text"
          placeholder="🔍  Search problems"
          className="input input-bordered w-full md:w-56 bg-base-100 text-base-content shadow-md"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="select select-bordered bg-base-100 shadow-md"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setCurrentPage(1);
          }}>
          <option value="ALL">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff.charAt(0) + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered bg-base-100 shadow-md"
          value={selectedTag}
          onChange={(e) => {
              setSelectedTag(e.target.value);
              setCurrentPage(1);
          }}>
          <option value="ALL">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      {/* Table */}
      <div className="overflow-x-auto shadow-xl bg-white/70 dark:bg-[#181824]/60 rounded-2xl transition">
        <table className="table table-lg text-base-content">
          <thead className="bg-gradient-to-r from-primary/10 to-primary/0 text-base font-bold">
            <tr>
              <th>Solved</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Difficulty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const isSolved = problem.solvedBy?.some(
                  (user) => user.userId === authUser?.userId
                );
                return (
                  <tr
                    key={problem.id}
                    className="hover:bg-primary/10 transition-all cursor-pointer"
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm accent-primary cursor-pointer"
                        title={isSolved ? "Solved" : "Not solved"}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="font-bold hover:underline transition text-secondary"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(problem.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="badge bg-blue-100 border-blue-400 text-blue-700 font-medium text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={clsx(
                          "badge border font-bold text-xs px-2 py-1 transition",
                          badgeColors[problem.difficulty] ||
                            "bg-gray-100 text-gray-700 border-gray-200"
                        )}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
                        {authUser?.role === "ADMIN" && (
                          <div className="flex gap-1">
                            <button
                              title="Delete"
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-sm btn-error hover:scale-105 transition"
                            >
                              <TrashIcon className="w-4 h-4 text-white" />
                            </button>
                            <button
                              title="Edit (Coming Soon)"
                              disabled
                              className="btn btn-sm btn-warning opacity-60"
                            >
                              <PencilIcon className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                        <button
                          title="Save to Playlist"
                          className="btn btn-sm btn-outline flex gap-2 items-center hover:bg-primary/10 transition"
                          onClick={() => handleAddToPlaylist(problem.id)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No problems found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemsTable;
