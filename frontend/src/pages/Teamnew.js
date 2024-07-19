import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Teamnew.css';
import defaultTeamImage from '../img/file.png';

const BatchTeam = () => {
    const navigate = useNavigate();
    const [latestBatch, setLatestBatch] = useState(null);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        fetchLatestBatch();
    }, []);

    const fetchLatestBatch = async () => {
        try {
            const response = await axios.get('https://project-k-s2nr.onrender.com/teams/latest-batch');
            const { latestBatch } = response.data;

            if (latestBatch) {
                setLatestBatch(latestBatch);
                fetchTeams(latestBatch);
            } else {
                console.error('No latest batch found.');
            }
        } catch (error) {
            console.error('Error fetching latest batch:', error);
        }
    };

    const fetchTeams = useCallback(async (batchName) => {
        try {
            const response = await axios.get(`https://project-k-s2nr.onrender.com/teams/${batchName}`);
            setTeams(response.data);
        } catch (error) {
            console.error('Error fetching team data:', error);
            alert('Error fetching team data');
        }
    }, []);

    const handleTeamClick = (teamNumber) => {
        navigate(`/teams/${latestBatch}/${teamNumber}`);
    };

    return (
        <div className="batch-team-container">
            {latestBatch && (
                <div className="selected-batch-container">
                    <h2 className="selected-batch-title">Our Teams</h2>
                    <div className='team-box-unique'>
                        {Array.from(new Set(teams.map(team => team.teamNumber)))
                            .sort((a, b) => a - b) // Sort team numbers in ascending order
                            .map((teamNumber) => (
                                <div key={teamNumber} className='card-unique' onClick={() => handleTeamClick(teamNumber)}>
                                    <div className='img-unique'>
                                        <img src={defaultTeamImage} alt={`Team ${teamNumber}`} className="team-image" />
                                    </div>
                                    <p className='title-unique'>Team {teamNumber}</p>
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