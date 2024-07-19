import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PassedOut.css';
import defaultTeamImage from '../img/teamlogo.png';

const BatchCard = ({ id, title, isChecked, onChange }) => (
  <>
    <input 
      type="radio" 
      name="slide" 
      id={id} 
      checked={isChecked} 
      onChange={onChange}
    />
    <label htmlFor={id} className="card-unique batch-card-unique">
      <div className="row-unique">
        <div className="img-unique batch-img-unique">
        </div>
        <div className="description-unique">
          <h4 className="title-unique batch-title-unique">{title}</h4>
        </div>
      </div>
    </label>
  </>
);


const BatchTeam = () => {
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const response = await axios.get('http://localhost:5000/teams/batches');
                // Sort batches in descending order based on batch name
                const sortedBatches = response.data.sort((a, b) => {
                    // Assuming batch names are like "Batch-YYYY"
                    const yearA = parseInt(a.split('-')[1]);
                    const yearB = parseInt(b.split('-')[1]);
                    return yearA - yearB;
                });
                setBatches(sortedBatches);
            } catch (error) {
                console.error('Error fetching batch data:', error);
                alert('Error fetching batch data');
            }
        };

        fetchBatches();
    }, []);

    const fetchTeams = useCallback(async (batchName) => {
        try {
            const response = await axios.get(`http://localhost:5000/teams/${batchName}`);
            setTeams(response.data);
        } catch (error) {
            console.error('Error fetching team data:', error);
            alert('Error fetching team data');
        }
    }, []);

    const handleBatchClick = (batchName) => {
        setSelectedBatch(batchName);
        fetchTeams(batchName);
    };

    const handleTeamClick = (teamNumber) => {
        navigate(`/teams/${selectedBatch}/${teamNumber}`);
    };

    return (
        <div className="batch-team-container-unique">
            <div className="wrapper-unique">
                <div className="container-unique batch-box-unique">
                    {batches.map((batch, index) => (
                        <BatchCard
                            key={batch}
                            id={`c${index + 1}`}
                            title={batch}
                            isChecked={selectedBatch === batch}
                            onChange={() => handleBatchClick(batch)}
                        />
                    ))}
                </div>
            </div>

            {selectedBatch && (
  <div className="selected-batch-container-unique">
    <h2 className="selected-batch-title-unique">Teams in {selectedBatch}</h2>
    <div className='team-box-unique'>
      {Array.from(new Set(teams.map(team => team.teamNumber)))
        .sort((a, b) => a - b) // Sort team numbers in ascending order
        .map((teamNumber) => (
          <div key={teamNumber} className='card-unique team-card-unique' onClick={() => handleTeamClick(teamNumber)}>
            <div className='img-unique team-img-unique'>
              <img src={defaultTeamImage} alt={`Team ${teamNumber}`} className="team-image-unique" />
            </div>
            <p className='title-unique team-title-unique'>Team {teamNumber}</p>
            <button className='view-details-unique'>View Details</button>
          </div>
        ))}
    </div>
  </div>
)}
        </div>
    );
};

export default BatchTeam;
