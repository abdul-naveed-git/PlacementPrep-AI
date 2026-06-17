import { useState } from "react";
import "../App.css";

function Signup() {
  const [isLogin, setIsLogin] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const BACKEND_URL = "http://localhost:3000";

  const handleVerifyMail = async () => {
    if (!email) return alert("Please enter your email first.");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message); // "A verification code has been dispatched."
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to server");
    }
  };

  // Step 2: Submit Full Form (Verify OTP & Create User Account)
  const handleSignUpSubmit = async () => {
    if (!email || !otp || !password || !confirmPassword) {
      return alert("Please fill in all signup fields.");
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful!");
        console.log("User data:", data.user);
        // Direct user to dashboard or change view to login
        setIsLogin(true);
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to complete signup.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>{isLogin ? "Sign In" : "Sign Up"}</h1>

        {isLogin ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="button" className="main-btn">
              Sign In
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <div className="field-row">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                className="verify-btn"
                onClick={handleVerifyMail}
              >
                Verify Mail
              </button>
            </div>

            <div className="field-row">
              <input
                type="text"
                placeholder="Enter Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button type="button" className="verify-btn">
                Verify
              </button>
            </div>

            <input
              type="password"
              placeholder="Set Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              className="main-btn"
              onClick={handleSignUpSubmit}
            >
              Sign Up
            </button>
          </>
        )}

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span className="switch-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Sign Up" : " Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
