import React, { useState } from "react";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import logoimage from "../assets/image.jpg";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useSelector((state) => state.user.user);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const navItems = [
    { name: "Home", path: "/" },
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
    <div className="bg-[#f1f5f9] text-black h-20 w-full fixed top-0 left-0 shadow-sm z-50">
      <div className="max-w-[1240px] mx-auto px-4 flex justify-between items-center h-full">
        {/* Circular Logo */}
        <Link to="/">
          <img
            src={logoimage}
            alt="Logo"
            className="h-12 w-12 object-cover rounded-full cursor-pointer"
          />
        </Link>

        {/* Nav Items */}
        <ul className="flex space-x-6">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className="px-3 py-2 rounded-md hover:bg-gray-200 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Avatar Dropdown */}
        <div className="relative flex items-center space-x-4">
          <div className="cursor-pointer" onClick={toggleDropdown}>
            <Avatar
              name={user?.fullName || "User"}
              size="35"
              round={true}
              textSizeRatio={2}
              color="#795548"
            />
          </div>

          {showDropdown && (
            <div className="absolute top-12 right-0 bg-white border rounded-md shadow-lg w-48 z-50">
              <ul className="py-2">
                {dropdownOptions.map((option, index) => (
                  <li key={index}>
                    <Link
                      to={option.path}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {option.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
