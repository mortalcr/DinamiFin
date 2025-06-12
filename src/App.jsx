import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import MesActual from "./components/mesActual";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F2F3F4]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mesActual" element={<MesActual />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
