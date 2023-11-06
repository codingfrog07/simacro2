import "./App.css";
import { Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing";
import Viewer from "./Pages/Viewer";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </div>
  );
}

export default App;
