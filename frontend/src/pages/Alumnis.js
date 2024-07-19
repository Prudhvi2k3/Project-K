import React, { useEffect, useState } from 'react';
import './Alumini.css'; // Ensure you import the CSS file

// Function to convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const AlumniPage = () => {
  const [alumniData, setAlumniData] = useState([]);

  useEffect(() => {
    // Fetch alumni data from the backend
    fetch('https://project-k-s2nr.onrender.com/alumni')
      .then((response) => response.json())
      .then((data) => setAlumniData(data))
      .catch((error) => console.error('Error fetching alumni data:', error));
  }, []);

  // Sort alumni data by batch year in ascending order
  const sortedAlumniData = alumniData.sort((a, b) => {
    const yearA = parseInt(a.batchName.split('-')[1]);
    const yearB = parseInt(b.batchName.split('-')[1]);
    return yearA - yearB;
  });

  const AlumniCard = ({ name, role, github, linkedin, email, photo, batchName }) => {
    const photoSrc = `data:image/png;base64,${arrayBufferToBase64(photo.data)}`;

    return (
      <div className="alumni-card">
        <img src={photoSrc} alt={`${name}'s photo`} className="alumni-photo" />
        <div className="alumni-info">
          <h2>{name}</h2>
          <p>{role}</p>
          <p>{batchName}</p>
          <div className="alumni-links">
            <a href={github} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href={`mailto:${email}`}>
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="alumni-container">
      {sortedAlumniData.map((alumni, index, array) => {
        const showBatchHeader = index === 0 || alumni.batchName !== array[index - 1].batchName;
        return (
          <React.Fragment key={alumni._id}>
            {showBatchHeader && <h2 className="batch-header">{alumni.batchName}</h2>}
            <AlumniCard
              name={alumni.name}
              role={alumni.role}
              github={alumni.github}
              linkedin={alumni.linkedin}
              email={alumni.email}
              photo={alumni.photo}
              batchName={alumni.batchName}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AlumniPage;
