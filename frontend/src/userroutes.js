import React from 'react';
import './App.css'
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OurWork from './pages/Ourwork';
import Passedout from './pages/Passedout';
import TeamMembers from './pages/TeamMembers';  // Import TeamDetails
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Team from './pages/Teamnew';
import EventCard from './pages/Events';
import Alumni from './pages/Alumnis';
import HomeBlog from './pages/HomeBlog';
import EventGalleryPage from './pages/EventGallery';
import ProjectPage from './admin/projectform';
import HackathonPage from './admin/hackthonForm';

const UserRoutes = () => (
  <>
    <Navbar />
    <div className="main-content"></div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/teams/:batchName/:teamNumber" element={<TeamMembers />} />
      <Route path="/ourwork" element={<OurWork />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/passedout" element={<Passedout />} />
      <Route path="/teamnew" element={<Team />} />
      <Route path="/blogs" element={<HomeBlog />} />
      <Route path="/events" element={<EventCard />} />
      <Route path="/event-gallery" element={<EventGalleryPage />} />
      <Route path="/projects" element={<ProjectPage />} />
      <Route path="/hackthons" element={<HackathonPage />} />
      <Route path="/alumni" element={<Alumni/>}/>
    </Routes>
    <Footer />
  </>
);

export default UserRoutes;
