import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TeamDetails.css';

const TeamDetails = () => {
  const { batchName } = useParams();
  const [teams, setTeams] = useState([]);
  const [editData, setEditData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [batches, setBatches] = useState([]);
  const [teamNumbers, setTeamNumbers] = useState([]);
  const [roles, setRoles] = useState([]);

  const fetchTeams = useCallback(async () => {
    try {
      const response = await axios.get(`https://project-k-s2nr.onrender.com/teams/${batchName}`);
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching team data:', error);
      alert('Error fetching team data');
    }
  }, [batchName]);

  useEffect(() => {
    fetchTeams();
    
    // Load batches, team numbers, and roles from localStorage
    const savedBatches = localStorage.getItem('batches');
    const savedTeams = localStorage.getItem('teams');
    const savedRoles = localStorage.getItem('roles');
    
    setBatches(savedBatches ? JSON.parse(savedBatches) : [ 'Batch-2023', 'Batch-2024']);
    setTeamNumbers(savedTeams ? JSON.parse(savedTeams) : [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    setRoles(savedRoles ? JSON.parse(savedRoles) : ['Team-Mentor', 'Team-Lead', 'Senior-Developer', 'Junior-Developer']);
  }, [fetchTeams]);

  const handleEdit = (team) => {
    setEditData(team);
  };

  const handleTeamClick = (teamNumber) => {
    setSelectedTeam(teamNumber);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://project-k-s2nr.onrender.com/teams/${batchName}/${id}`);
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team data:', error);
      alert('Error deleting team data');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEditData({
      ...editData,
      [name]: files ? files[0] : value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { _id, ...data } = editData;
    const form = new FormData();
    for (const key in data) {
      form.append(key, data[key]);
    }
    try {
      await axios.put(`https://project-k-s2nr.onrender.com/teams/${batchName}/${_id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setEditData(null);
      fetchTeams();
    } catch (error) {
      console.error('Error updating team data:', error);
      alert('Error updating team data');
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const groupedTeams = teams.reduce((acc, team) => {
    const teamNumber = team.teamNumber;
    if (!acc[teamNumber]) {
      acc[teamNumber] = [];
    }
    acc[teamNumber].push(team);
    return acc;
  }, {});

  return (
    <div>
      <h2>Batch: {batchName}</h2>
      <div className="team-cards">
        {Object.keys(groupedTeams).map((teamNumber) => (
          <div key={teamNumber} className="team-card" onClick={() => handleTeamClick(teamNumber)}>
            <h3>Team {teamNumber}</h3>
          </div>
        ))}
      </div>

      {selectedTeam && groupedTeams[selectedTeam] && (
        <div>
          <h3>Team {selectedTeam}</h3>
          <div className="teams-container">
            {groupedTeams[selectedTeam].map((team) => (
              <div key={team._id} className="team-card">
                <h4>Name: {team.name}</h4>
                <p>Role: {team.role}</p>
                <p>GitHub: <a href={team.github}>{team.github}</a></p>
                <p>LinkedIn: <a href={team.linkedin}>{team.linkedin}</a></p>
                <img
                  src={`data:image/jpeg;base64,${arrayBufferToBase64(team.photo.data)}`}
                  alt={team.name}
                  width="100"
                />
                <button onClick={() => handleEdit(team)}>Edit</button>
                <button onClick={() => handleDelete(team._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {editData && (
        <form onSubmit={handleUpdate}>
          <select
            name="batchName"
            value={editData.batchName}
            onChange={handleChange}
            required
          >
            <option value="">Select Batch</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
          <select
            name="teamNumber"
            value={editData.teamNumber}
            onChange={handleChange}
            required
          >
            <option value="">Select Team Number</option>
            {teamNumbers.map((teamNumber) => (
              <option key={teamNumber} value={teamNumber}>Team {teamNumber}</option>
            ))}
          </select>
          <select
            name="role"
            value={editData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={editData.name}
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="github"
            placeholder="GitHub URL"
            value={editData.github}
            onChange={handleChange}
            required
          />
          <input
            type="url"
            name="linkedin"
            placeholder="LinkedIn URL"
            value={editData.linkedin}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default TeamDetails;
