import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import MyTypeOfMan from "./pages/forms/MyTypeOfMan";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-bf" element={<MyTypeOfMan />} />
      </Routes>
    </Router>
  );
}

export default App;
