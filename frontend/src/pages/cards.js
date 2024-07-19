import React, { useState } from "react";
import "./cards.css";
import { FaGithub } from 'react-icons/fa';

export const Card = ({
  imgSrc,
  imgAlt,
  title,
  description,
  buttonText,
  allImages,
  fullDescription,
  githubLink,
  oneLineDescription,
  largeDescription
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const renderImage = (image) => {
    if (image && image.data) {
      const base64String = btoa(
        new Uint8Array(image.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:image/jpeg;base64,${base64String}`;
    }
    return image || "https://picsum.photos/id/201/300/200";
  };

  return (
    <div className="card-container">
      {imgSrc && <img src={renderImage(imgSrc)} alt={imgAlt} className="card-img" />}
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{oneLineDescription || description}</p>
      <button className="card-btn" onClick={() => setShowPopup(true)}>
        {buttonText || "Learn More"}
      </button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>{title}</h2>
            <div className="popup-images">
              {allImages ? allImages.map((image, index) => (
                <img 
                  key={index} 
                  src={renderImage(image)} 
                  alt={`${title} -  ${index + 1}`} 
                  className="popup-img"
                />
              )) : imgSrc && <img src={renderImage(imgSrc)} alt={imgAlt} className="popup-img" />}
            </div>
            <p className="popup-oneline-description">{oneLineDescription || description}</p>
            <p className="popup-full-description">{largeDescription || fullDescription}</p>
            {githubLink && (
              <a href={githubLink} target="_blank" rel="noopener noreferrer" className="github-link">
                <FaGithub /> View on GitHub
              </a>
            )}
            <button className="close-btn" onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};