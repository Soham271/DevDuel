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
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <label className="block mb-1">Current Password</label>
          <input
            type="password"
            name="currentpassword"
            value={data.currentpassword}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            name="newpassword"
            value={data.newpassword}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Confirm New Password</label>
          <input
            type="password"
            name="confirmationpassword"
            value={data.confirmationpassword}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
