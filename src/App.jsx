import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ExamOptions from "./components/examoptions";
import QuestionManager from "./components/questionsmanagerment";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/teacher/:id" element={<QuestionManager />} />
        <Route path="/examoption/:id" element={<ExamOptions />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

