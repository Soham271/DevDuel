import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import Navbar from "./Navbar";
import TermsModal from "@/components/TermsModal";

function CreateContest() {
  const user = useSelector((state) => state.user.user);
  const [createContestData, setCreateContestData] = useState({
    Title: "",
    Level: "",
    Duration: "",
    Language: "",
  });

  const [contestCode, setContestCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();

  const headingRef = useRef(null);
  const formRef = useRef(null);
  const modalOverlayRef = useRef(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
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
      formRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: "power2.out",
      }
    );

    if (showModal) {
      gsap.fromTo(
        modalOverlayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        modalContentRef.current,
        { scale: 0.8, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }
  }, [showModal]);

  const handleCreateContest = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Please accept the Terms and Conditions to create a contest.");
      return;
    }
    const code = Math.floor(10000000 + Math.random() * 90000000);
    setContestCode(code);

    try {
      await axios.post(
        "http://localhost:3004/api/v1/contenst/create-contest",
        { ...createContestData, Code: code },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setShowModal(true);
    } catch (err) {
      console.error("Error creating contest:", err);
    }
  };

  const handleCodeClick = () => {
    navigator.clipboard.writeText(contestCode.toString());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowModal(false);
      navigate("/Join-Battle", { state: { contestCode } });
    }, 1500);
  };

  return (
    <div className="bg-black min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-12">
        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-10 text-center tracking-tight"
        >
          Create a <span className="text-amber-500">New Contest</span>
        </h1>

        <form
          ref={formRef}
          onSubmit={handleCreateContest}
          className="w-full max-w-md bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <label className="text-lg sm:text-xl font-medium text-gray-300 mb-3 block">
            Contest Title
          </label>
          <input
            type="text"
            value={createContestData.Title}
            onChange={(e) =>
              setCreateContestData({
                ...createContestData,
                Title: e.target.value,
              })
            }
            required
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
          />

          <label className="text-lg sm:text-xl font-medium text-gray-300 mt-6 mb-3 block">
            Difficulty Level
          </label>
          <select
            value={createContestData.Level}
            onChange={(e) =>
              setCreateContestData({
                ...createContestData,
                Level: e.target.value,
              })
            }
            required
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
          >
            <option value="" disabled>
              --Select--
            </option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label className="text-lg sm:text-xl font-medium text-gray-300 mt-6 mb-3 block">
            Time Duration
          </label>
          <select
            value={createContestData.Duration}
            onChange={(e) =>
              setCreateContestData({
                ...createContestData,
                Duration: e.target.value,
              })
            }
            required
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
          >
            <option value="" disabled>
              --Select--
            </option>
            <option value="5min">5 Minutes</option>
            <option value="10min">10 Minutes</option>
            <option value="20min">20 Minutes</option>
            <option value="30min">30 Minutes</option>
            <option value="40min">40 Minutes</option>
            <option value="50min">50 Minutes</option>
            <option value="1hr">1 Hour</option>
          </select>

          <label className="text-lg sm:text-xl font-medium text-gray-300 mt-6 mb-3 block">
            Programming Language
          </label>
          <select
            value={createContestData.Language}
            onChange={(e) =>
              setCreateContestData({
                ...createContestData,
                Language: e.target.value,
              })
            }
            required
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
          >
            <option value="" disabled>
              --Select--
            </option>
            <option value="C">C</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
          </select>

          <label className="text-base sm:text-lg text-gray-300 mt-6 flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              className="mr-2 h-4 w-4 text-amber-500 border-gray-700 rounded focus:ring-amber-500 bg-gray-800"
            />
            I accept the{" "}
            <span
              onClick={() => setShowTermsModal(true)}
              className="underline text-amber-500 hover:text-amber-400 transition-colors duration-300 ml-1"
            >
              Terms and Conditions
            </span>
          </label>

          <button
            type="submit"
            disabled={!termsAccepted}
            className={`mt-6 w-full py-3 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 ${
              termsAccepted
                ? "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Create Contest
          </button>
        </form>

        {/* Contest Created Modal */}
        {showModal && (
          <div
            ref={modalOverlayRef}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          >
            <div
              ref={modalContentRef}
              className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg text-center max-w-sm w-full"
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-amber-500 mb-4">
                Contest Created Successfully!
              </h3>
              <div
                onClick={handleCodeClick}
                className="text-2xl sm:text-3xl font-mono text-white bg-gray-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-300"
              >
                {contestCode}
              </div>
              <p className="text-gray-400 mt-3 text-sm sm:text-base">
                Click on code to copy
              </p>
              {copied && (
                <p className="text-amber-400 mt-3 text-sm sm:text-base animate-pulse">
                  Code copied successfully!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Terms and Conditions Modal */}
        <TermsModal
          visible={showTermsModal}
          onClose={() => setShowTermsModal(false)}
        />
      </div>
    </div>
  );
}

export default CreateContest;