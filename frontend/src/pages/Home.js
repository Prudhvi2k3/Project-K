// src/pages/Home.js

import React, { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import exampleImage from '../img/pic1.png';
import advisor1 from '../img/adv1.jpg';
import advisor2 from '../img/adv2.jpg';
import advisor3 from '../img/adv3.jpeg';
import advisor4 from '../img/adv4.jpg';
import EventCard from './Events';

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const Home = () => {
  const [achievements, setAchievements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/achievement');
        const fetchedAchievements = response.data;

        const achievementsWithImages = fetchedAchievements.map(achievement => ({
          ...achievement,
          imageUrl: achievement.image ? `data:image/jpeg;base64,${arrayBufferToBase64(achievement.image.data)}` : null
        }));

        setAchievements(achievementsWithImages);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div className="home-page-wrapper">
      <div className="home-page-container">
        <div className="welcome-section">
        <button className="welcome-button-primary" onClick={() => navigate('/admin')}>
        Welcome to K-HUB
      </button>
        </div>
      </div>
      <div className="main-content-section">
        <div className="main-text-container">
          <p>
            K – Hub is a center established in 2022, at Kakinada Institute of Engineering and Technology (KIET) in affiliation with International Institute of Information Technology, Hyderabad (IIIT-H). We empower your future by offering cutting-edge internships, bridging academics with professional excellence. With us, you're not just gaining an internship; you're gaining a pathway to shaping the world around you. Welcome to Khub – where modern excellence meets your boundless potential.
          </p>
        </div>
        <div className="main-image-container">
          <img src={exampleImage} alt="Example" />
        </div>
      </div>
      <div className="mission-statement-section">
        <h2 className="mission-heading">Our Mission</h2>
        <p className="mission-description">
          Our mission is to create a platform that bridges the gap between academic learning and professional experience. We aim to nurture talent and provide opportunities for students to excel in their chosen fields through hands-on internships and real-world projects.
        </p>
      </div>
      <div className="advisors-section">
        <h2 className="advisors-heading">Program Advisors</h2>
        <div className="advisors-gallery">
          <div className="advisor-card">
            <img className="advisor-image" src={advisor1} alt="Advisor 1" />
            <h3 className="advisor-name">Ramesh Loganathan</h3>
            <p className="advisor-title">Professor of Practice, Co-Innovation, IIIT-Hyderabad.</p>
          </div>
          <div className="advisor-card">
            <img className="advisor-image" src={advisor2} alt="Advisor 2" />
            <h3 className="advisor-name">P Viswam</h3>
            <p className="advisor-title">Chairman, KIET Group of Institutions-korangi.</p>
          </div>
          <div className="advisor-card">
            <img className="advisor-image" src={advisor3} alt="Advisor 3" />
            <h3 className="advisor-name">D Revathi</h3>
            <p className="advisor-title">Principal, KIET-korangi.</p>
          </div>
          <div className="advisor-card">
            <img className="advisor-image" src={advisor4} alt="Advisor 4" />
            <h3 className="advisor-name">Y Rama Krishna</h3>
            <p className="advisor-title">Principal, KIET W-korangi.</p>
          </div>
        </div>
      </div>
      <div className="achievements-section">
        <h2 className="achievements-heading">Our Achievements</h2>
        <div className="achievements-gallery">
          {achievements.map((achievement) => (
            <div className="achievement-item" key={achievement._id}>
              {achievement.imageUrl && <img className="achievement-icon" src={achievement.imageUrl} alt={achievement.title} />}
              <p className="achievement-number">{achievement.number}+</p>
              <p className="achievement-description">{achievement.title}</p>
            </div>
          ))}
        </div>
      </div>
      <EventCard />
    </div>
  );
};

export default Home;
