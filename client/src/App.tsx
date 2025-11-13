import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Achievements from "./pages/Achievements";
import Shop from "./pages/Shop";
import Familiars from "./pages/Familiars";
import Inventory from "./pages/Inventory";
import Activities from "./pages/Activities";
import Battle from "./pages/Battle";
import Training from "./pages/Training";
import Adopt from "./pages/Adopt";
import Pound from "./pages/Pound";
import Crafting from "./pages/Crafting";
import Rest from "./pages/Rest";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/familiars" element={<Familiars />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/training" element={<Training />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/pound" element={<Pound />} />
        <Route path="/crafting" element={<Crafting />} />
        <Route path="/rest" element={<Rest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
