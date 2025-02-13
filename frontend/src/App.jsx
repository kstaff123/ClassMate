import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Homepage } from "./pages/Homepage";
import { Routes, Route } from "react-router-dom";
import { CourseBrowser } from "./pages/CourseBrowser";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/CourseBrowser" element={<CourseBrowser/>} />
      </Routes>
    </div>
  );
}

export default App;
