import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register'; 
import Login from './components/Login';
import Profile from './components/Profile';
import SecondPhase from './components/SecondPhase';
import CreateGamingGroup from './components/CreateGamingGroup';
import GamingGroupDetails from './components/GamingGroupDetails';
import UserProfile from './components/UserProfile';
import FriendRequests from './components/FriendRequests';
import MyFriends from './components/MyFriends';
import GamingSession from './components/GamingSession';
import ManageSessions from './components/ManageSessions';
import Invitations from './components/Invitations';
import SearchUser from './components/SearchUser';
import SearchGroups from './components/SearchGroups';
import UserJoinedSessions from './components/UserJoinedSessions';
import Notifications from './components/Notifications';
import Home from "./components/Home";



const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/second-phase" element={<SecondPhase />} />
      <Route path="/create-gaming-group" element={<CreateGamingGroup />} />
      <Route path="/groups/:groupId" element={<GamingGroupDetails />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/friendRequests" element={<FriendRequests />} />
      <Route path="/myFriends" element={<MyFriends />} />
      <Route path="/gamingSession" element={<GamingSession />} />
      <Route path="/manageSessions" element={<ManageSessions />} />
      <Route path="/invitations" element={<Invitations />} />
      <Route path="/searchUsers" element={<SearchUser />} />
      <Route path="/searchGroups" element={<SearchGroups />} />
      <Route path="/joinedSessions" element={<UserJoinedSessions />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
};

export default AppRouter;