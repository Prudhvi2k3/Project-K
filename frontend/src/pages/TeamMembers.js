import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TeamMember.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const TeamMembers = () => {
  const { batchName, teamNumber } = useParams();
  const [teamMembers, setTeamMembers] = useState([]);


  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/teams/${batchName}/team/${teamNumber}`);
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team data:', error);
      alert('Error fetching team data');
    }
  }, [batchName, teamNumber]);


  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);


  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };


  const renderMember = (member) => (
    <div key={member.id} className="container">
      <div className="outer">
        <div className="content">
          <div className="image-box">
            {member.photo && member.photo.data ? (
              <img
                src={`data:image/jpeg;base64,${arrayBufferToBase64(member.photo.data)}`}
                alt={member.name}
              />
            ) : (
              <img src="../img/Event1.jpg" alt="Default" />
            )}
          </div>
          <div className="details">
            <div className="name">{member.name}</div>
            <div className="job">{member.role}</div>
            <div className="media-icons">
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i>
                </a>
              )}
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-envelope"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const teamLeads = teamMembers.filter(member => member.role === 'Team-Lead');
  const teamMentors = teamMembers.filter(member => member.role === 'Team-Mentor');
  const seniorDevelopers = teamMembers.filter(member => member.role === 'Senior-Developer');
  const juniorDevelopers = teamMembers.filter(member => member.role === 'Junior-Developer');


  return (
    <div className="team-members-container">
      <h2 className="batch-info">{batchName}</h2>
      <h3 className="team-info">Team {teamNumber}</h3>
     
      <div className="leadership-section">
        <div className="leadership-row">
          {teamLeads.length > 0 && (
            <div className="leadership-column">
              <h1>Team Lead</h1>
              {teamLeads.map(renderMember)}
            </div>
          )}
          {teamMentors.length > 0 && (
            <div className="leadership-column">
              <h1>Team Mentor</h1>
              {teamMentors.map(renderMember)}
            </div>
          )}
        </div>
      </div>
     
      {seniorDevelopers.length > 0 && (
        <div className="developer-section">
          <h1>Senior Developers</h1>
          <div className="developer-row">
            {seniorDevelopers.map(renderMember)}
          </div>
        </div>
      )}
     
      {juniorDevelopers.length > 0 && (
        <div className="developer-section">
          <h1>Junior Developers</h1>
          <div className="developer-row">
            {juniorDevelopers.map(renderMember)}
          </div>
        </div>
      )}
    </div>
  );
};


export default TeamMembers;