import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import styled from "styled-components";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearAllUserError } from "@/Store/UserSlice";
import { toast } from "react-toastify";

// Firebase
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // JWT Email/Password Login
  const handleJWTLogin = () => {
    try {
      dispatch(login(user.email, user.password));
    } catch (err) {
      toast.error(err || "login Failed");
    }
  };

  // Firebase Google Auth
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const name = result.user.displayName;

      toast.success(`Welcome ${name}!`);
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error("Google sign-in failed");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserError());
    }

    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate("/home");
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  return (
    <StyledWrapper>
      <div className="login-box">
        <div className="header">
          <h1>WELCOME TO DEVDUELS</h1>
          <p className="tagline">Unleash Your Skills. Challenge the World.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJWTLogin();
          }}
        >
          <div className="user-box">
            <input
              required
              name="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <label>Email</label>
          </div>

          <div className="user-box">
            <input
              required
              name="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <label>Password</label>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Login
            </button>
          </div>

          <button onClick={handleGoogleLogin} className="google-login-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M21.35 11.1H12v2.82h5.37c-.23 1.3-.93 2.4-1.98 3.14v2.6h3.2c1.88-1.73 2.96-4.28 2.96-7.27 0-.64-.06-1.26-.2-1.85z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.7 0 4.97-.89 6.63-2.42l-3.2-2.6c-.88.6-2.02.96-3.43.96-2.64 0-4.88-1.78-5.68-4.18H3.03v2.63C4.67 19.78 8.07 22 12 22z"
              />
              <path
                fill="#FBBC05"
                d="M6.32 13.76A5.98 5.98 0 0 1 6 12c0-.61.11-1.2.32-1.76V7.61H3.03A9.997 9.997 0 0 0 2 12c0 1.58.37 3.07 1.03 4.39l3.29-2.63z"
              />
              <path
                fill="#EA4335"
                d="M12 6.14c1.47 0 2.8.51 3.84 1.51l2.88-2.88C17.03 2.93 14.76 2 12 2 8.07 2 4.67 4.22 3.03 7.61l3.29 2.63c.8-2.4 3.04-4.18 5.68-4.18z"
              />
            </svg>
            Login with Google
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          New Here?{" "}
          <a href="/signup" className="a2">
            Signup
          </a>
          <a href="/forgetPassword" className="a2 ml-9">
            Forget Password
          </a>
        </p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  background: url("https://images.unsplash.com/photo-1612831668413-7b8d25154f2b?auto=format&fit=crop&w=1950&q=80")
    no-repeat center center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 0;
  }

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 900px;
    padding: 40px;
    margin: 20px auto;
    transform: translate(-50%, -55%);
    background: rgba(0, 0, 0, 0.9);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    z-index: 2;
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
  }

  .header h1 {
    font-size: 2.5rem;
    color: #fff;
    font-weight: bold;
    letter-spacing: 1.5px;
  }

  .tagline {
    color: #f4f4f4;
    font-size: 1.2rem;
    font-weight: 400;
    margin-top: 10px;
  }

  .user-box {
    position: relative;
  }

  .user-box input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
    background: transparent;
  }

  .user-box label {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    pointer-events: none;
    transition: 0.5s;
  }

  .user-box input:focus ~ label,
  .user-box input:valid ~ label {
    top: -20px;
    left: 0;
    color: #fff;
    font-size: 12px;
  }

  .submit-button {
    position: relative;
    display: inline-block;
    padding: 12px 24px;
    font-weight: bold;
    color: #fff;
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s;
    margin-top: 20px;
    letter-spacing: 3px;
    background: transparent;
    border: 1px solid white;
    cursor: pointer;
  }

  .submit-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .submit-button span {
    position: absolute;
    display: block;
  }

  .submit-button span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #fff);
    animation: btn-anim1 1.5s linear infinite;
  }

  .submit-button span:nth-child(2) {
    top: -100%;
    right: 0;
    height: 100%;
    width: 2px;
    background: linear-gradient(180deg, transparent, #fff);
    animation: btn-anim2 1.5s linear infinite;
    animation-delay: 0.25s;
  }

  .submit-button span:nth-child(3) {
    bottom: 0;
    left: 100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #fff);
    animation: btn-anim3 1.5s linear infinite;
    animation-delay: 0.5s;
  }

  .submit-button span:nth-child(4) {
    top: 100%;
    left: 0;
    height: 100%;
    width: 2px;
    background: linear-gradient(180deg, transparent, #fff);
    animation: btn-anim4 1.5s linear infinite;
    animation-delay: 0.75s;
  }

  @keyframes btn-anim1 {
    100% {
      left: 100%;
    }
  }
  @keyframes btn-anim2 {
    100% {
      top: 100%;
    }
  }
  @keyframes btn-anim3 {
    100% {
      left: -100%;
    }
  }
  @keyframes btn-anim4 {
    100% {
      top: -100%;
    }
  }

  .google-login-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 30px;
    margin-top: 20px;
    width: 100%;
    background-color: #000000;
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    text-align: center;

  }
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translate(-50%, -65%);
    }
    100% {
      opacity: 1;
      transform: translate(-50%, -55%);
    }
  }

  .login-box {
    animation: fadeInUp 0.8s ease-out forwards;
    opacity: 0;
  }

  }
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translate(-50%, -65%);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -55%);
  }
}

.login-box {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}



  .google-login-btn svg {
    margin-right: 10px;
  }
`;

export default Login;
