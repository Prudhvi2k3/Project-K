import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./projects.css";
import { Card } from "./cards";

function Project() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    fetchProjects();
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://project-k-s2nr.onrender.com/project');
      const sortedProjects = response.data.sort((a, b) => b._id.localeCompare(a._id));
      setProjects(sortedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const updateItemsPerPage = () => {
    if (window.innerWidth <= 768) {
      setItemsPerPage(1);
    } else if (window.innerWidth <= 992) {
      setItemsPerPage(2);
    } else if (window.innerWidth <= 1200) {
      setItemsPerPage(3);
    } else {
      setItemsPerPage(4);
    }
  };

  const handlePrev = () => {
    setCurrentPage((prevPage) => 
      prevPage === 0 ? Math.floor((projects.length - 1) / itemsPerPage) : prevPage - 1
    );
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => 
      (prevPage + 1) * itemsPerPage >= projects.length ? 0 : prevPage + 1
    );
  };

  const renderCards = () => {
    if (projects.length === 0) {
      return <p>No projects available.</p>;
    }

    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, projects.length);
    const currentProjects = projects.slice(startIndex, endIndex);

    return (
      <div className="project-carousel-container">
        {projects.length > itemsPerPage && (
          <button className="project-arrow project-arrow-left" onClick={handlePrev}>
            &lt;
          </button>
        )}
        <div className="project-carousel">
          {currentProjects.map((project) => (
            <div key={project._id} className="project-carousel-item">
              <Card
                imgSrc={project.images && project.images[0]}
                imgAlt={project.title}
                title={project.title}
                description={project.oneLineDescription}
                buttonText="Learn More"
                fullDescription={project.largeDescription}
                githubLink={project.githubLink}
                allImages={project.images}
              />
            </div>
          ))}
        </div>
        {projects.length > itemsPerPage && (
          <button className="project-arrow project-arrow-right" onClick={handleNext}>
            &gt;
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="project-section">
      <h2 className="project-section-heading">Projects</h2>
      {renderCards()}
    </section>
  );
}

export default Project;