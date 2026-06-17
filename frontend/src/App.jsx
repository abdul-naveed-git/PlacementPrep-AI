import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;