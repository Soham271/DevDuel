import React, { useState } from "react";
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ForgetPassword = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data } = await axios.post(
        "http://localhost:3004/api/v1/user/password/forget",
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setMessage(data.message);
      navigate(`/password/reset/${data.token}`);
    } catch (err) {
      console.error("Error details:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Forgot Password
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-gray-800"
                  aria-label="Email address"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="ml-2">Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Send Reset Link</span>
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                )}
              </button>
            </form>

            {message && (
              <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl animate-fadeIn flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-green-800 text-sm">{message}</p>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl animate-fadeIn flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-8 text-center">
              <a
                href="/"
                className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                Return to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
