import React, { useState, useEffect } from "react";
import { Navigation } from "./components/general/navigation";
import { Header } from "./components/general/header";
import { Exam } from "./components/general/examonline";
import { About } from "./components/general/about";
import { Documents } from "./components/general/documents";
import { Extensions } from "./components/general/extensions";
import { Contact } from "./components/general/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const Home = () => {
  const [pageData, setPageData] = useState({});
  useEffect(() => {
    setPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigation data={pageData.Accounts}/>
      <Header data={pageData.Header}/>
      <About data={pageData.About}/>
      <Exam data={pageData.Subjects} />
      <Documents data={pageData.Documents} />
      <Extensions data={pageData.Testimonials} />
      <Contact data={pageData.Contact} />
    </div>
  );
};

export default Home;
