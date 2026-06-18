import { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Signup from "./pages/Signup";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { authUserSchema, getFirstZodErrorMessage } from "./lib/validation";
import { apiRequest } from "./lib/api";

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [appError, setAppError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        const currentUser = await apiRequest("/api/user/profile");
        if (!active) return;

        const parsed = authUserSchema.safeParse(currentUser);
        if (!parsed.success) {
          setAppError(
            getFirstZodErrorMessage(
              parsed.error,
              "Received an invalid authentication response.",
            ),
          );
          setUser(null);
        } else {
          setUser(parsed.data);
          localStorage.setItem(
            "pf_fullName",
            parsed.data.fullName || "User Profile",
          );
        }
      } catch (error) {
        if (error.status !== 401) {
          setAppError(error.message || "Failed to load your session.");
        }
      } finally {
        if (active) setAuthReady(true);
      }
    };

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    const parsed = authUserSchema.safeParse(loggedInUser);

    if (!parsed.success) {
      const message = getFirstZodErrorMessage(
        parsed.error,
        "Received an invalid authentication response.",
      );
      setAppError(message);
      return;
    }

    setAppError(null);
    localStorage.setItem("pf_fullName", parsed.data.fullName || "User Profile");
    setUser(parsed.data);
    setAuthReady(true);
  };

  const handleLogout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    localStorage.removeItem("pf_fullName");
    localStorage.removeItem("pf_year");
    localStorage.removeItem("pf_dept");
    setUser(null);
    setAuthReady(true);
  };

  return (
    <BrowserRouter>
      {appError && (
        <div className="fixed top-4 left-1/2 z-[100] w-[min(92vw,640px)] -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-lg">
          {appError}
        </div>
      )}
      {!authReady ? (
        <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
          Restoring session...
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Signup onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Signup onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
