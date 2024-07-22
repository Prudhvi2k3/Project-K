import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRoutes from './userroutes';
import AdminRoutes from './adminroutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
