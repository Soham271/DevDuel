import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
const Home = () => {
  const user = useSelector((state) => state.user.user);
  console.log("user", user.fullName);
  return (
    <>
      <Navbar />
      <div className="pt-24 text-center">
        <h1 className="text-4xl font-bold">
          Hello, Welcome to Home:- {user.fullName}
        </h1>
      </div>
    </>
  );
};

export default Home;
