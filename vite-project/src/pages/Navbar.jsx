import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "react-avatar";
import logoimage from "../assets/image.jpg";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const darkPreference = localStorage.getItem("theme") === "dark";
    setIsDarkMode(darkPreference);
    document.documentElement.classList.toggle("dark", darkPreference);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Create Contest", path: "/create-contest" },
    { name: "Join Contest", path: "/join-contest" },
  ];

  const dropdownOptions = [
    { name: "Profile", path: "/profile" },
    { name: "Edit Profile", path: "/edit-profile" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Logout", path: "/logout" },
  ];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-gray-900 text-black dark:text-white h-20 fixed top-0 left-0 w-full shadow-md z-50"
    >
      <div className="max-w-[1240px] mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/">
          <img
            src={logoimage}
            alt="Logo"
            className="h-12 w-12 rounded-full object-cover cursor-pointer 
                       hover:scale-105 hover:shadow-xl transition-transform duration-300"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6 font-medium">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.path}
                className={`px-4 py-2 rounded-2xl transition duration-300 ${
                  location.pathname === item.path
                    ? "bg-indigo-200 text-indigo-900 dark:bg-indigo-600 dark:text-white"
                    : "hover:bg-gradient-to-r from-indigo-100 to-indigo-200 dark:hover:from-indigo-700 dark:hover:to-indigo-600"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              // Sun Icon (inline SVG)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 3.75a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5A.75.75 0 0110 3.75zm0 11.5a.75.75 0 01.75.75v.5a.75.75 0 01-1.5 0v-.5a.75.75 0 01.75-.75zM3.75 10a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zm11.5 0a.75.75 0 01.75-.75h.5a.75.75 0 010 1.5h-.5a.75.75 0 01-.75-.75zM6.22 6.22a.75.75 0 011.06 0l.35.35a.75.75 0 11-1.06 1.06l-.35-.35a.75.75 0 010-1.06zm6.19 6.19a.75.75 0 011.06 0l.35.35a.75.75 0 11-1.06 1.06l-.35-.35a.75.75 0 010-1.06zM6.22 13.78a.75.75 0 010-1.06l.35-.35a.75.75 0 011.06 1.06l-.35.35a.75.75 0 01-1.06 0zm6.19-6.19a.75.75 0 010-1.06l.35-.35a.75.75 0 111.06 1.06l-.35.35a.75.75 0 01-1.06 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
              </svg>
            ) : (
              // Moon Icon (inline SVG)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800 dark:text-gray-200"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.293 13.293a8 8 0 01-10.586-10.586 8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-300"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <Avatar
                name={user?.fullName || "User"}
                size="35"
                round
                textSizeRatio={2}
                color="#795548"
              />
            </div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  key="dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 right-0 bg-white dark:bg-gray-800 border dark:border-gray-700 
                             rounded-xl shadow-lg w-48 z-50"
                >
                  <ul className="py-2">
                    {dropdownOptions.map((opt, i) => (
                      <li key={i}>
                        <Link
                          to={opt.path}
                          className="block px-4 py-2 hover:bg-gradient-to-r from-indigo-100 to-indigo-200 
                                     dark:hover:from-indigo-700 dark:hover:to-indigo-600 rounded-md transition duration-200"
                        >
                          {opt.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    showMobileMenu
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-md border-t dark:border-gray-700"
          >
            {navItems.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.path}
                  className={`block px-4 py-3 border-b dark:border-gray-700 ${
                    location.pathname === item.path
                      ? "bg-indigo-200 dark:bg-indigo-600 text-indigo-900 dark:text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
