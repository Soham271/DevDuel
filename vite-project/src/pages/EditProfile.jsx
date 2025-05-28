import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, updatePassword } from "@/Store/UserSlice";
import gsap from "gsap";
import Navbar from "./Navbar";

const EditProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const message = useSelector((state) => state.user.message);

  const headingRef = useRef(null);
  const cardRef = useRef(null);

  const [data, setData] = React.useState({
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

    // GSAP Animations
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: "power2.out",
      }
    );
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
    <div className="bg-black min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-10 text-center tracking-tight"
        >
          Edit <span className="text-purple-400">Profile</span>
        </h1>

        <div
          ref={cardRef}
          className="w-full max-w-md bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-200">
              Edit Profile
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mt-2 leading-relaxed">
              Update your personal information and password below.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-900/50 border border-red-800 rounded-xl flex items-start">
                  <p className="text-red-400 text-sm sm:text-base">{error}</p>
                </div>
              )}
              {message && (
                <div className="p-4 bg-green-900/50 border border-green-800 rounded-xl flex items-start">
                  <p className="text-green-400 text-sm sm:text-base">{message}</p>
                </div>
              )}

              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={data.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentpassword"
                  value={data.currentpassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newpassword"
                  value={data.newpassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-base sm:text-lg font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmationpassword"
                  value={data.confirmationpassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <a
              href="/profile"
              className="text-purple-400 hover:text-purple-300 text-base sm:text-lg font-medium transition-colors duration-300"
            >
              Back to Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;