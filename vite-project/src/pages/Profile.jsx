import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetMyProfile } from "@/Store/UserSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(GetMyProfile());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                My Profile
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                View your personal information below.
              </p>
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-fadeIn flex items-start">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative group">
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile?.fullName || "Not available"}
                    disabled
                    className="w-full pl-3 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-800"
                  />
                </div>

                <div className="relative group">
                  <label className="block mb-1">Phone</label>
                  <input
                    type="text"
                    value={profile?.phone || "Not available"}
                    disabled
                    className="w-full pl-3 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-800"
                  />
                </div>

                <div className="relative group">
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    value={profile?.email || "Not available"}
                    disabled
                    className="w-full pl-3 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-800"
                  />
                </div>
              </div>
            )}
            <div className="mt-8 text-center">
              <a
                href="/edit-profile"
                className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                Edit Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
