import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-white text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Login with Google or Email + Password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white"
            >
              🔵 Login with Google
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-500"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleJWTLogin();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                className="bg-gray-800 text-white placeholder-gray-400 border-gray-600"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:text-blue-300">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
