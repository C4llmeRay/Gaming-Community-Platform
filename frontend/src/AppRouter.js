import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register'; 
import Login from './components/Login';
import Profile from './components/Profile';
import SecondPhase from './components/SecondPhase';
import CreateGamingGroup from './components/CreateGamingGroup';
import GamingGroupDetails from './components/GamingGroupDetails';



const AppRouter = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/second-phase" element={<SecondPhase />} />
      <Route path="/create-gaming-group" element={<CreateGamingGroup />} />
      <Route path="/groups/:groupId" element={<GamingGroupDetails />} />
    </Routes>
  );
};

export default AppRouter;