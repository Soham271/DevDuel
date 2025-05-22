import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, updatePassword } from "@/Store/UserSlice";

const EditProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const message = useSelector((state) => state.user.message);

  const [data, setData] = useState({
    fullName: "",
    phone: "",
    currentpassword: "",
    newpassword: "",
    confirmationpassword: "",
  });

  useEffect(() => {
    if (profile) {
      setData((prev) => ({
        ...prev,
        fullName: profile.fullName || "",
        phone: profile.phone || "",
      }));
    }
  }, [profile]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateProfile(data.fullName, data.phone));

    if (data.currentpassword && data.newpassword && data.confirmationpassword) {
      dispatch(
        updatePassword(
          data.currentpassword,
          data.newpassword,
          data.confirmationpassword
        )
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Edit Profile
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Update your personal information and password here.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-fadeIn flex items-start">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              {message && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl animate-fadeIn flex items-start">
                  <p className="text-green-800 text-sm">{message}</p>
                </div>
              )}

              <div className="relative group">
                <label className="block mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={data.fullName}
                  onChange={handleChange}
                  className="w-full pl-3 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-800"
                  placeholder="Enter your name"
                />
              </div>

              <div className="relative group">
                <label className="block mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  className="w-full pl-3 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-800"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="relative group">
                <label className="block mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentpassword"
                  value={data.currentpassword}
                  onChange={handleChange}
                  className="w-full pl-3 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-800"
                />
              </div>

              <div className="relative group">
                <label className="block mb-1">New Password</label>
                <input
                  type="password"
                  name="newpassword"
                  value={data.newpassword}
                  onChange={handleChange}
                  className="w-full pl-3 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-800"
                />
              </div>

              <div className="relative group">
                <label className="block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmationpassword"
                  value={data.confirmationpassword}
                  onChange={handleChange}
                  className="w-full pl-3 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="group w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
