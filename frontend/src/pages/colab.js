import React from "react";
import "./colab.css";

// Import images
import iiit from '../images/iiit.png';
import rajreddy from '../images/rajareddy.png';
import smartcity from '../images/smart.png';
import hubdata from '../images/hubdata.png';
import cyber from '../images/cyber.png';
import toastmaster from '../images/techleads.png';
import techleads from '../images/toastmaster1.png';


const images = [
  { id: 1, src: iiit},
  { id: 2, src: rajreddy},
  { id: 3, src: smartcity},
  { id: 4, src: hubdata},
  { id: 5, src: cyber},
  { id: 6, src: toastmaster},
  { id: 7, src: techleads}
];

const Colab = () => {
  const itemsPerRow = 4;

  return (
    <div className="App">
      <h1 className="projects-heading">Our Collaborations</h1>
      <div className="carousel-container">
        {images.reduce((rows, image, index) => {
          if (index % itemsPerRow === 0) rows.push([]);
          rows[rows.length - 1].push(image);
          return rows;
        }, []).map((row, rowIndex) => (
          <div key={rowIndex} className="carousel">
            {row.map((image) => (
              <div className="carousel-item" key={image.id}>
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                  }}
                />
                <div className="title">{image.alt}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Colab;