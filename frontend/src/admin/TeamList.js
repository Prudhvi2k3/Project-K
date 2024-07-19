import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import './TeamList.css'; // Assuming you have some CSS for styling



const TeamList = () => {
    const navigate = useNavigate();
   
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        const savedBatches = localStorage.getItem('batches');
        setBatches(savedBatches ? JSON.parse(savedBatches) : ['Batch-2023', 'Batch-2024']);
    }, []);

    const handleBatchClick = (batchName) => {
        navigate(`/teams/${batchName}`);
    };

    

    return (
        <div>
            

            <h2>Select a Batch</h2>
            <div className="batch-cards">
                {batches.map((batch) => (
                    <div key={batch} className="batch-card" onClick={() => handleBatchClick(batch)}>
                        <h3>{batch}</h3>
                    </div>
                ))}
            </div>
            
        </div>
    );
};

export default TeamList;