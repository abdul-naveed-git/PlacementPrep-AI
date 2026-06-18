import { useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Signup from "./pages/Signup";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("pf_token"));

  const handleLoginSuccess = (loggedInUser, authToken) => {
    localStorage.setItem("pf_token", authToken);
    localStorage.setItem("pf_fullName", loggedInUser.fullName || "User Profile");
    setUser(loggedInUser);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("pf_token");
    setUser(null);
    setToken(null);
  };

  return (
    <BrowserRouter>
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
