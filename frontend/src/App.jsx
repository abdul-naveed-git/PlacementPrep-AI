import { useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Signup from "./pages/Signup";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import { authResponseSchema, getFirstZodErrorMessage } from "./lib/validation";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("pf_token"));
  const [appError, setAppError] = useState(null);

  const handleLoginSuccess = (loggedInUser, authToken) => {
    const parsed = authResponseSchema.safeParse({
      user: loggedInUser,
      token: authToken,
    });

    if (!parsed.success) {
      const message = getFirstZodErrorMessage(
        parsed.error,
        "Received an invalid authentication response.",
      );
      setAppError(message);
      localStorage.removeItem("pf_token");
      return;
    }

    setAppError(null);
    localStorage.setItem("pf_token", parsed.data.token);
    localStorage.setItem(
      "pf_fullName",
      parsed.data.user.fullName || "User Profile",
    );
    setUser(parsed.data.user);
    setToken(parsed.data.token);
  };

  const handleLogout = () => {
    localStorage.removeItem("pf_token");
    setUser(null);
    setToken(null);
  };

  return (
    <BrowserRouter>
      {appError && (
        <div className="fixed top-4 left-1/2 z-[100] w-[min(92vw,640px)] -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
          {appError}
        </div>
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<Signup onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/signup"
          element={<Signup onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard
                user={user}
                onUserLoaded={setUser}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
