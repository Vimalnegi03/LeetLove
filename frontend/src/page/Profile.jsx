import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, User, Shield, Image } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import ProfileSubmission from "../components/ProfileSubmission";
import ProblemSolvedByUser from "../components/ProblemSolvedByUser";
import PlaylistProfile from "../components/PlaylistProfile";

const Profile = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-rose-50 to-purple-100 dark:from-[#181824] dark:to-[#27293d] flex flex-col items-center py-6 px-2 md:px-4 w-full">
      {/* Header with back button */}
      <div className="w-full max-w-4xl flex flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="ml-2 text-3xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-blue-600 to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
            Profile
          </h1>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="card bg-white/80 dark:bg-base-100/90 shadow-2xl rounded-2xl backdrop-blur-md border-2 border-primary/10 mb-10">
          <div className="card-body">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 py-4">
              {/* Avatar */}
              <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-primary to-fuchsia-400 text-white rounded-full w-28 h-28 ring ring-primary ring-offset-base-100 ring-offset-2 relative flex items-center justify-center">
                  {authUser.image ? (
                    <img
                      src={authUser.image}
                      alt={authUser.name}
                      className="rounded-full object-cover w-28 h-28"
                    />
                  ) : (
                    <span className="text-5xl font-extrabold uppercase">{authUser.name ? authUser.name.charAt(0) : "U"}</span>
                  )}
                </div>
              </div>
              {/* Name and Role Badge */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary drop-shadow-lg">
                  {authUser.name}
                </h2>
                <div className="inline-block mt-3">
                  <span
                    className={`badge text-white px-4 py-2 font-semibold text-md uppercase
                      ${
                        authUser.role === "ADMIN"
                          ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 "
                          : "bg-gradient-to-r from-blue-600 to-indigo-500 "
                      }`}
                  >
                    {authUser.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="divider mt-2 mb-4" />

            {/* Profile Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Email */}
              <div className="stat bg-base-200/70 rounded-xl shadow-sm">
                <div className="stat-figure text-primary">
                  <Mail className="w-7 h-7" />
                </div>
                <div className="stat-title">Email</div>
                <div className="stat-value text-base break-all">{authUser.email}</div>
              </div>
              {/* User ID */}
              <div className="stat bg-base-200/70 rounded-xl shadow-sm">
                <div className="stat-figure text-primary">
                  <User className="w-7 h-7" />
                </div>
                <div className="stat-title">User ID</div>
                <div className="stat-value text-xs break-all">{authUser.id}</div>
              </div>
              {/* Role w/ Icon */}
              <div className="stat bg-base-200/70 rounded-xl shadow-sm">
                <div className="stat-figure text-primary">
                  <Shield className="w-7 h-7" />
                </div>
                <div className="stat-title">Role</div>
                <div className="stat-value text-base capitalize">{authUser.role}</div>
                <div className="stat-desc">
                  {authUser.role === "ADMIN" ? "Full system access" : "Regular user"}
                </div>
              </div>
              {/* Profile Image */}
              <div className="stat bg-base-200/70 rounded-xl shadow-sm">
                <div className="stat-figure text-primary">
                  <Image className="w-7 h-7" />
                </div>
                <div className="stat-title">Profile Image</div>
                <div className="stat-value text-base">
                  {authUser.image ? "Uploaded" : "Not Set"}
                </div>
                <div className="stat-desc">
                  {authUser.image ? "Image available" : "Upload a profile picture"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-end mt-8 gap-3">
             <Link to="/update-profile" className="btn btn-outline btn-primary px-5">
  Edit Profile
</Link>
              <button className="btn btn-primary px-5">Change Password</button>
            </div>
          </div>
        </div>

        {/* Extra Sections */}
        <div className="space-y-8">
          {/* Submissions */}
          <div className="card bg-white/80 dark:bg-base-100/80 shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-blue-700">Your Submissions</h2>
            <ProfileSubmission />
          </div>

          {/* Solved Problems */}
          <div className="card bg-white/80 dark:bg-base-100/80 shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-green-700">Problems Solved</h2>
            <ProblemSolvedByUser />
          </div>

          {/* Playlists */}
          <div className="card bg-white/80 dark:bg-base-100/80 shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-3 text-fuchsia-700">Your Playlists</h2>
            <PlaylistProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
