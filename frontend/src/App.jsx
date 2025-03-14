import "./App.css";
import { Homepage } from "./pages/Homepage";
import { Routes, Route } from "react-router-dom";
import { CourseBrowser } from "./pages/CourseBrowser";
import { CartProvider } from "./components/CartContext";

function App() {
  return (
    <div>
      <CartProvider>
        <div className="font-[Montserrat]">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/CourseBrowser" element={<CourseBrowser />} />
          </Routes>
        </div>
      </CartProvider>
    </div>
  );
}

export default App;
