import React, { useState, useEffect } from "react";
import "./focus.css";

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const Focus = () => {
  const [images, setImages] = useState([]);
  const itemsPerRow = 4;

  useEffect(() => {
    // Fetch images from the backend
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/focusarea');
        const data = await response.json();
        // Convert ArrayBuffer to base64 for each image
        const processedImages = data.sort((a, b) => b._id.localeCompare(a._id)).map(image => ({
          ...image,
          src: `data:${image.contentType};base64,${arrayBufferToBase64(image.image.data)}`
        }));
        setImages(processedImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="App">
      <h1 className="projects-heading">Focus Areas</h1>
      <div className="carousel-container">
        {images.reduce((rows, image, index) => {
          if (index % itemsPerRow === 0) rows.push([]);
          rows[rows.length - 1].push(image);
          return rows;
        }, []).map((row, rowIndex) => (
          <div key={rowIndex} className="carousel">
            {row.map((image) => (
              <div className="carousel-item" key={image._id}>
                <img 
                  src={image.src} 
                  alt={image.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                  }}
                />
                <div className="title">{image.title}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Focus;