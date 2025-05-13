import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { toast } from "react-toastify";
const SignUp = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmationpassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const collectData = async (e) => {
    e.preventDefault();

    const { email, password, confirmationpassword } = user;

    if (password !== confirmationpassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3004/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmationpassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User signed up successfully!");
        navigate("/");
      } else {
        toast.error(data.message || "Signup failed.");
      }
    } catch (error) {
      // This will catch network/parse errors (not 400s)
      toast.error(error.message || "Something went wrong.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden">
      {/* SignUp Card */}
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 hover:shadow-2xl transition-shadow duration-300 z-10">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create an Account
        </h2>
        <form onSubmit={collectData} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmationpassword"
              value={user.confirmationpassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full p-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-900 mt-4">
          Already have an account?{" "}
          <a
            href="/"
            className="underline text-blue-800 hover:text-blue-500 transition-all duration-300"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
