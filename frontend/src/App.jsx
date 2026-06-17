import { useState } from "react";
import "./App.css";
import Signup from "./pages/Signup";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <div>
      <LandingPage />
      <Signup />
    </div>
  );
}

export default App;