import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaProjectDiagram, FaCalendarAlt, FaTrophy, FaBlog, FaCode, FaGraduationCap } from 'react-icons/fa'; // Import the FaGraduationCap icon
import { Card, Row, Col } from 'antd';
import focusIcon from '../img/focus.jpg'; // Make sure this path is correct
import './Home.css'; // Import the CSS file

const AdminDashboard = () => {
  const navigate = useNavigate(); // Use the useNavigate hook

  const cardData = [
    { title: 'Teams', icon: <FaUsers />, color: '#1890ff', route: '/admin/TeamForm' },
    { title: 'Projects', icon: <FaProjectDiagram />, color: '#52c41a', route: '/admin/projects' },
    { title: 'Events', icon: <FaCalendarAlt />, color: '#faad14', route: '/admin/events' },
    { title: 'Achievements', icon: <FaTrophy />, color: '#eb2f96', route: '/admin/achievements' },
    { title: 'Blogs', icon: <FaBlog />, color: '#722ed1', route: '/admin/blogs' },
    { title: 'Focus Areas', icon: <img src={focusIcon} alt="Focus Areas" />, color: '#389e0d', route: '/admin/focus-areas' },
    { title: 'Hackathons', icon: <FaCode />, color: '#1890ff', route: '/admin/hackathons' },
    { title: 'Alumni', icon: <FaGraduationCap />, color: '#ff5722', route: '/admin/alumni' } // New Alumni card
  ];

  const handleCardClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Welcome Admin</h1>
      <Row gutter={[16, 16]}>
        {cardData.map((card, index) => (
          <Col xs={24} sm={12} md={8} lg={8} key={index}>
            <Card
              hoverable
              className="admin-dashboard-card"
              style={{ background: card.color }}
              onClick={() => handleCardClick(card.route)} // Add onClick to handle navigation
            >
              <div className="admin-dashboard-card-icon">
                {card.icon}
              </div>
              <h2>{card.title}</h2>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminDashboard;
