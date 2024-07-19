import React from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import TeamForm from './admin/TeamForm';
import TeamList from './admin/TeamList';
import TeamDetails from './admin/TeamDetails';
import AlumniManager from './admin/alumni';
import Blogs from './admin/blogs';
import Events from './admin/event';
import AchievementsManager from './admin/achievement';
import FocusAreasManager from './admin/focusarea';
import ProjectPage from './admin/project';
import HackathonPage from './admin/hackthonForm';
import AdminDashboard from './admin/Home';
import Signup from './admin/signup';
import Login from './admin/signin';
import ForgotPassword from './admin/forgotpassword';
import ResetPassword from './admin/resetpassword';
import ApproveUser from './admin/approveadmin';
import ProtectedRoute from './admin/ProtectedRoute';
import Header from './admin/logout';
import './App.css';

const AdminRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
    <Route path="/activation/:activation_token" element={<ApproveUser />} />

    <Route element={<ProtectedRoute />}>
      <Route
        element={
          <>
          <div className="main-content">
            <Header />
            <Outlet />
            </div>
          </>
        }
      >
        <Route path="/main" element={<AdminDashboard />} />
        <Route path="/TeamForm" element={<TeamForm />} />
        <Route path="/batch" element={<TeamList />} />
        <Route path="/teams/:batchName" element={<TeamDetails />} />
        <Route path="/alumni" element={<AlumniManager />} />
        <Route path="/achievements" element={<AchievementsManager />} />
        <Route path="/focus-areas" element={<FocusAreasManager />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/hackathons" element={<HackathonPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/events" element={<Events />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/admin/login" replace />} />
  </Routes>
);

export default AdminRoutes;
