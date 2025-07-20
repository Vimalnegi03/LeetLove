import React from "react";
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { authUser } = useAuthStore();

  // Fallback to initials if no image/profile photo
  const avatarInitial = authUser?.name?.[0]?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 w-full py-5 select-none">
      <div className="flex w-full justify-between mx-auto max-w-5xl bg-white/20 dark:bg-black/30 shadow-lg 
        shadow-purple-700/5 backdrop-blur-lg border border-fuchsia-300/30 py-2 px-4 sm:px-8 rounded-[2rem] items-center">

        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer transition-transform hover:scale-[1.04]">
          <img
            src="/logo.png"
            className="h-14 w-14 bg-gradient-to-tr from-primary/20 via-fuchsia-500/20 to-indigo-400/10 text-primary ring-2 ring-primary/40 border-none p-2 rounded-full shadow-lg shadow-fuchsia-200/10"
            alt="Leetlove"
          />
          <span className="hidden sm:block text-2xl font-extrabold tracking-tight bg-gradient-to-r from-fuchsia-500 via-blue-500 to-indigo-400 text-transparent bg-clip-text transition-all group-hover:brightness-125">
            Leetlove
          </span>
        </Link>

        {/* Right/Dropdown */}
        <div className="flex items-center gap-8">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex flex-row items-center shadow hover:ring-2 hover:ring-fuchsia-400/60 transition cursor-pointer">
              <div className="w-12 h-12 rounded-full ring-2 ring-fuchsia-400 ring-offset-2 overflow-hidden bg-gradient-to-tr from-fuchsia-100 via-violet-100 to-blue-100 text-fuchsia-700 flex items-center justify-center font-bold text-lg">
                {authUser?.image ? (
                  <img
                    src={authUser.image}
                    alt={authUser.name}
                    className="object-cover rounded-full w-11 h-11"
                  />
                ) : (
                  <img src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f0/f0b71b7609ea68eae9e9acadff26b1926ace5ab7_full.jpg"/>
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-30 p-3 rounded-xl bg-white/80 dark:bg-black/90 border border-violet-300/40 shadow-2xl backdrop-blur-2xl w-56 space-y-1"
            >
              <li className="mb-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-gray-600 dark:text-white/70 truncate">
                  <User className="w-4 h-4 text-primary" />
                  {authUser?.name || "User"}
                </div>
                <hr className="border-t border-violet-400/10 my-2" />
              </li>
              <li>
                <Link
                  to="/profile"
                  className="rounded-lg px-2 py-2 gap-2 flex items-center hover:bg-fuchsia-100 dark:hover:bg-fuchsia-700/20 font-medium transition"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span>My Profile</span>
                </Link>
              </li>
              {authUser?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className="rounded-lg px-2 py-2 gap-2 flex items-center hover:bg-blue-100 dark:hover:bg-blue-800/40 font-medium transition"
                  >
                    <Code className="w-4 h-4 text-fuchsia-600" />
                    <span>Add Problem</span>
                  </Link>
                </li>
              )}
              <li>
                <LogoutButton className="rounded-lg px-2 py-2 gap-2 flex items-center hover:bg-fuchsia-200 dark:hover:bg-fuchsia-900/30 font-medium transition text-fuchsia-700">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
