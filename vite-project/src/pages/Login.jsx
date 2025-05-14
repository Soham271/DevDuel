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
        <p>Sign Up</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleJWTLogin();
          }}>
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
          {/* <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white"
            >
              🔵 Login with Google
            </Button>
          </div> */}



          <div className="button-group">
            <button type="submit" className="submit-button">
              <span></span><span></span><span></span><span></span>
              Login
            </button>

          </div>
          <button onClick={handleGoogleLogin} className="google-login-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
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
        </p>
      </div>



    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`

  min-height: 100vh;
  background: url('https://images.unsplash.com/photo-1612831668413-7b8d25154f2b?auto=format&fit=crop&w=1950&q=80') no-repeat center center/cover;
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

  .login-box p:first-child {
    margin: 0 0 30px;
    padding: 0;
    color: #fff;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 1px;
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

  .phone-wrapper {
    position: relative;
    margin-bottom: 30px;
  }

 .phone-wrapper label {
  position: static;      /* Remove absolute positioning */
  display: block;
  margin-bottom: 6px;    /* Space between label and input */
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: none;
}

  .phone-wrapper label.active {
    top: -20px;
 
    font-size: 12px;
    color: #fff;
  }

  .phone-input-inner {
    display: flex;
    align-items: center;
    background: transparent;
  }

  .PhoneInput input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    color: #fff;
    background: transparent;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
  }

  .terms-wrapper {
    color: #fff;
    font-size: 14px;
    margin: 10px 0 30px;
  }

  .terms-link {
    color: #00f;
    cursor: pointer;
    text-decoration: underline;
  }

  .submit-button {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
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
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #fff);
    animation: btn-anim2 1.5s linear infinite;
    animation-delay: 0.375s;
  }

  .submit-button span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #fff);
    animation: btn-anim3 1.5s linear infinite;
    animation-delay: 0.75s;
  }

  .submit-button span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #fff);
    animation: btn-anim4 1.5s linear infinite;
    animation-delay: 1.125s;
  }

  @keyframes btn-anim1 { 0% { left: -100%; } 50%, 100% { left: 100%; } }
  @keyframes btn-anim2 { 0% { top: -100%; } 50%, 100% { top: 100%; } }
  @keyframes btn-anim3 { 0% { right: -100%; } 50%, 100% { right: 100%; } }
  @keyframes btn-anim4 { 0% { bottom: -100%; } 50%, 100% { bottom: 100%; } }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
  }

  .modal-content {
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    width: 500px;
    color: #000;
    text-align: left;
    position: relative;
  }

  .modal-content h2 {
    margin-top: 0;
  }

  .modal-content ul {
    padding-left: 20px;
  }

  .modal-content .close-modal {
    margin-top: 20px;
    padding: 10px 20px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

    .terms-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: #fff;
    font-size: 14px;
    margin: 10px 0 30px;
    line-height: 1.4;
  }

  .terms-wrapper input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #fff;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s ease;
    margin-top: 2px;
  }

  .terms-wrapper input[type="checkbox"]:checked {
    background-color: #00f;
    border-color: #00f;
  }

  .terms-wrapper input[type="checkbox"]:checked::after {
    content: '✔';
    color: #fff;
    font-size: 12px;
    position: absolute;
    left: 3px;
    top: -1px;
  }

  .terms-link {
    color: #00f;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.3s ease;
  }

  .terms-link:hover {
    color: #66f;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: #111;
    color: #fff;
    padding: 30px 40px;
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
    position: relative;
    text-align: left;
  }

  .modal-content h2 {
    margin-top: 0;
    font-size: 22px;
    margin-bottom: 15px;
    color: #00f;
  }

  .modal-content ul {
    padding-left: 20px;
    margin-bottom: 20px;
    font-size: 15px;
  }

  .modal-content ul li {
    margin-bottom: 10px;
  }

  .modal-content .close-modal {
    background: #00f;
    color: #fff;
    border: none;
    padding: 10px 18px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .modal-content .close-modal:hover {
    background: #0055ff;
  }

    .terms-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #fff;
    font-size: 14px;
    margin: 10px 0 30px;
    flex-wrap: wrap;
  }

  .terms-label {
    line-height: 1.4;
  }

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    display: none;
  }

  .container {
    --size: 20px;
    width: var(--size);
    height: var(--size);
    background-color: #191A1E;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3px;
    box-shadow:
      1.5px 1.5px 3px #0e0e0e,
      -1.5px -1.5px 3px rgba(95, 94, 94, 0.25),
      inset 0px 0px 0px #0e0e0e,
      inset 0px -0px 0px #5f5e5e;
    transition: all 0.3s ease;
  }

  .checkmark {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow:
      1.5px 1.5px 3px #0e0e0e,
      -1.5px -1.5px 3px rgba(95, 94, 94, 0.25),
      inset 0px 0px 0px #0e0e0e,
      inset 0px -0px 0px #5f5e5e;
    transition: all 0.3s ease;
    padding: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .checkmark svg {
    opacity: 0;
    transition: all 0.3s ease;
  }

  .container input:checked + .checkmark {
    box-shadow:
      inset 1.5px 1.5px 3px #0e0e0e,
      inset -1.5px -1.5px 3px #5f5e5e;
  }

  .container input:checked + .checkmark svg {
    opacity: 1;
  }
.modal-content {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  width: 600px; /* Increased width */
  max-height: 80vh;
  overflow-y: auto;
  color: #000;
  text-align: left;
  position: relative;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-top: 0;
  font-size: 24px;
  margin-bottom: 20px;
}

.terms-list {
  padding-left: 20px;
  list-style-type: disc;
  font-size: 15px;
  line-height: 1.6;
}

.terms-list li {
  margin-bottom: 12px;
}

.close-modal {
  margin-top: 25px;
  padding: 10px 25px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: background 0.3s ease;
}

.close-modal:hover {
  background: #333;
}
/* From Uiverse.io by Yaya12085 */
.google-login-btn {
  max-width: 320px;
  display: flex;
  padding: 0.5rem 1.4rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.25);
  gap: 0.75rem;
  color: rgb(65, 63, 63);
  background-color: #fff;
  cursor: pointer;
  transition: all .6s ease;
}

.google-login-btn svg {
  height: 24px;
}

.google-login-btn:hover {
  transform: scale(1.02);
}
/* Fix standard login button spacing and style */
.submit-button {
  display: inline-block;
  position: relative;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background-color: #000;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  margin-bottom: 16px; /* space between login and Google buttons */
}

.submit-button:hover {
  background-color: white;
  color: black;
}

/* Fix any potential :after pseudo glitch */
.submit-button::after {
  content: none;
}
/* Centering container */
.center-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #0d0d0d; /* Optional dark background */
}

/* Main login button */
.submit-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  background-color: black;
  border: 2px solid white;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: 0.3s ease;
}

.submit-button:hover {
  background-color: white;
  color: black;
}

/* Google login button */
.google-login-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  background-color: white;
  color: #444;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
.google-login-button img {
  height: 20px;
  width: 20px;
}

`;

export default Login;
