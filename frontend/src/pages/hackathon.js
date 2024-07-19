import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./hackathon.css";
import { Card } from "./cards";

function Hackathon() {
  const [hackathons, setHackathons] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    fetchHackathons();
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const fetchHackathons = async () => {
    try {
      const response = await axios.get('https://project-k-s2nr.onrender.com/hackathon');
      const sortedHackathons = response.data.sort((a, b) => b._id.localeCompare(a._id));
      setHackathons(sortedHackathons);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
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
      prevPage === 0 ? Math.floor((hackathons.length - 1) / itemsPerPage) : prevPage - 1
    );
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => 
      (prevPage + 1) * itemsPerPage >= hackathons.length ? 0 : prevPage + 1
    );
  };

  const renderCards = () => {
    if (hackathons.length === 0) {
      return <p>No hackathons available.</p>;
    }

    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, hackathons.length);
    const currentHackathons = hackathons.slice(startIndex, endIndex);

    return (
      <div className="hackathon-carousel-container">
        {hackathons.length > itemsPerPage && (
          <button className="hackathon-arrow hackathon-arrow-left" onClick={handlePrev}>
            &lt;
          </button>
        )}
        <div className="hackathon-carousel">
          {currentHackathons.map((hackathon) => (
            <div className="hackathon-carousel-item" key={hackathon._id}>
              <Card 
                imgSrc={hackathon.images && hackathon.images[0]}
                imgAlt={`Hackathon ${hackathon.title}`}
                title={hackathon.title}
                oneLineDescription={hackathon.oneLineDescription}
                buttonText="Learn More"
                allImages={hackathon.images}
                largeDescription={hackathon.largeDescription}
              />
            </div>
          ))}
        </div>
        {hackathons.length > itemsPerPage && (
          <button className="hackathon-arrow hackathon-arrow-right" onClick={handleNext}>
            &gt;
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="hackathon-section">
      <h1 className="hackathon-heading">Hackathons</h1>
      {renderCards()}
    </div>
  );
}

export default Hackathon;