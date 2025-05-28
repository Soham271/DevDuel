// Details.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";

// Function to generate a color based on email (simple hash)
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${"00000".substring(0, 6 - c.length)}${c}`;
};

// Function to get initials from name
const getInitials = (name) => {
  if (!name) return "??";
  const nameParts = name.trim().split(" ");
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (
    nameParts[0].charAt(0).toUpperCase() +
    (nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "")
  );
};

const Details = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3004/api/v1/details/get",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDetails(response.data.message);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load contest details.");
        setLoading(false);
        toast.error("Failed to load contest details.");
      }
    };

    fetchDetails();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500 py-8">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;
  if (details.length === 0)
    return (
      <div className="text-center text-gray-500 py-8">
        No contest details found.
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <Navbar />
      <ToastContainer />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-10">
          Your <span className="text-purple-400">Contest Details</span>
        </h2>
        <div className="space-y-6">
          {details.map((detail) => {
            const percentage = (
              (detail.Score * 100) /
              detail.TotalScore
            ).toFixed(1);
            const badgeColor = stringToColor(detail.user.email);
            const initials = getInitials(detail.user.name);

            return (
              <div
                key={detail._id}
                className="bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 transition-shadow duration-300 hover:shadow-xl border border-gray-800"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
                    style={{ backgroundColor: badgeColor }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {detail.user.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {detail.user.email}
                    </p>
                  </div>
                </div>
                <div className="text-gray-300 space-y-2">
                  <p>
                    <strong>Contest ID:</strong> {detail.Contest_id}
                  </p>
                  <p>
                    <strong>Score:</strong> {detail.Score} / {detail.TotalScore}{" "}
                    <span className="text-blue-400">({percentage}%)</span>
                  </p>
                  <p>
                    <strong>Language:</strong> {detail.Language}
                  </p>
                  <p>
                    <strong>Submitted At:</strong>{" "}
                    {new Date(detail.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Details;
