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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        My Profile
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          <div className="text-lg text-gray-700">
            <span className="font-semibold">Full Name:</span> {profile.fullName}
          </div>
          <div className="text-lg text-gray-700">
            <span className="font-semibold">Phone:</span> {profile.phone}
          </div>
          <div className="text-lg text-gray-700">
            <span className="font-semibold">Email:</span> {profile.email}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
