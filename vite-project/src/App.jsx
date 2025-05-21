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
import ContestEnded from "./pages/ContestEnded";
import Joincontest from "./pages/Joincontest";
import { element } from "prop-types";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
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
      path: "/contest-ended",
      element: <ContestEnded />,
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
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
