import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.auth?.user);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>
      <div className="bg-white shadow rounded p-6">
        <div className="mb-3">
          <span className="text-slate-500">Name</span>
          <div className="text-slate-800 font-medium">{user?.name || "-"}</div>
        </div>
        <div className="mb-3">
          <span className="text-slate-500">Username</span>
          <div className="text-slate-800 font-medium">{user?.username || "-"}</div>
        </div>
        <div className="mb-3">
          <span className="text-slate-500">User ID</span>
          <div className="text-slate-800 font-medium">{user?.id || "-"}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;