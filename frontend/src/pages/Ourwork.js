import React from "react";
import { Route, Routes } from "react-router-dom";
import Project from "./projects";
import Hackathon from "./hackathon";
import Focus from './focus';
import Colab from './colab';
import "./Ourwork.css";

function AllContent() {
  return (
    <div className="Allcontent">
      <Routes>
        <Route path="/projects" element={<Project />} />
        <Route path="/hackathon" element={<Hackathon />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/colab" element={<Colab />} />
        
        <Route
          path="/"
          element={
            <>
              <Project />
              <Hackathon />
              <Focus />
              <Colab />

            </>
          }
        />
      </Routes>
    </div>
  );
}

export default AllContent;