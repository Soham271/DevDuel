import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import CreateContest from "./pages/CreateContest";
import JoinBattle from "./pages/JoinBattle";
import LeaderBoard from "./pages/Leaderboard";
import Joincontest from "./pages/Joincontest";
import { element } from "prop-types";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/Reset-Password";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/create-contest",
      element: <CreateContest />,
    },
    {
      path: "/Join-Battle",
      element: <JoinBattle />,
    },

    {
      path: "/leaderboard",
      element: <LeaderBoard/>,
    },
    {
      path: "/join-contest",
      element: <Joincontest />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/edit-profile",
      element: <EditProfile />,
    },
    {
      path: "/forgetPassword",
      element: <ForgetPassword />,
    },
    {
      path: "/password/reset/:token",
      element: <ResetPassword />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
