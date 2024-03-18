import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ExamOptions from "./components/examoptions";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/detail/:id" element={<ExamOptions />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

