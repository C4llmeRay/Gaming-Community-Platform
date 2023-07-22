import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupDetails, getUserProfile, leaveGroup, kickMember, promoteMember, demoteMember, transferOwnership, joinGroup } from '../api';
import { io } from 'socket.io-client';

const GamingGroupDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [groupDetails, setGroupDetails] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]); // State to store chat messages

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        // Fetch the user profile to get the currentUser information
        const userProfile = await getUserProfile();
        setCurrentUser(userProfile);

        const response = await getGroupDetails(groupId, userProfile.token);
        setGroupDetails(response);
        console.log(response);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const [socket, setSocket] = useState(null);

useEffect(() => {
  // Create a Socket.IO instance and connect to the server
  const newSocket = io('http://localhost:5000', {
    query: { groupId }, // Send the groupId as a query parameter
  });

  // Save the Socket.IO instance in state
  setSocket(newSocket);

  // Check if the socket is connected
  console.log('Is socket connected?', newSocket.connected);

  // Clean up the socket connection when the component unmounts
  return () => newSocket.disconnect();
}, [groupId]);

  // Handle sending chat messages
  const handleSendMessage = () => {
  const messageObject = {
    text: message,
    groupId: groupDetails._id,
    sender: currentUser.username,
  };

  console.log("Sending chat message:", messageObject); // Add this line to log the message being sent

  socket.emit('chatMessage', messageObject);
  setMessage(''); // Clear the input field after sending the message
};

  // UseEffect to listen for incoming messages
  useEffect(() => {
  if (socket) {
    socket.on('message', (message) => {
      console.log('Received message:', message);
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });
  }
}, [socket]);
 
  const handleKickMember = async (memberId) => {
    try {
      console.log('Kicking member:', memberId); 
      await kickMember(groupId, memberId);
      // After kicking the member, update the group details
      const updatedGroupDetails = await getGroupDetails(groupId);
      console.log('Updated group details after kick:', updatedGroupDetails); 
      setGroupDetails(updatedGroupDetails);
    } catch (error) {
      console.error('Error kicking member:', error);
    }
  };

  const handlePromoteMember = async (memberId) => {
    try {
      console.log('Promoting member:', memberId); 
      await promoteMember(groupId, memberId);
      // After promoting the member, update the group details
      const updatedGroupDetails = await getGroupDetails(groupId);
      console.log('Updated group details after promote:', updatedGroupDetails); 
      setGroupDetails(updatedGroupDetails);
    } catch (error) {
      console.error('Error promoting member:', error);
    }
  };

  const handleDemoteMember = async (memberId) => {
    try {
      await demoteMember(groupId, memberId);
      // After demoting the member, update the group details
      const updatedGroupDetails = await getGroupDetails(groupId);
      setGroupDetails(updatedGroupDetails);
    } catch (error) {
      console.error('Error demoting member:', error);
    }
  };

  const handleTransferOwnership = async () => {
    try {
      await transferOwnership(groupId, currentUser._id);
      // After transferring ownership, update the group details
      const updatedGroupDetails = await getGroupDetails(groupId);
      setGroupDetails(updatedGroupDetails);
    } catch (error) {
      console.error('Error transferring ownership:', error);
    }
  };

  const handleJoinOrLeaveGroup = async () => {
  try {
    if (isMember) {
      // User is a member, so leave the group
      await leaveGroup(groupId);
    } else {
      // User is not a member, so join the group
      await joinGroup(groupId);
    }

    // After joining or leaving the group, update the group details
    const updatedGroupDetails = await getGroupDetails(groupId);
    setGroupDetails(updatedGroupDetails);
  } catch (error) {
    console.error('Error joining or leaving group:', error);
  }
};

  if (!groupDetails) {
    return <div>Loading...</div>;
  }
   
  const isMember = currentUser && groupDetails.members.some((member) => member._id === currentUser._id);

console.log("chatMessages:", chatMessages);


  return (
  <div>
    {/* Group details... */}
    <h2>Gaming Group Details</h2>
    <p>Name: {groupDetails.name}</p>
    <p>Description: {groupDetails.description}</p>
    <p>Rules: {groupDetails.rules}</p>
    <p>Privacy: {groupDetails.privacy}</p>
    <p>Members:</p>
    <ul>
      {groupDetails.members.map((member) => (
        <li key={member._id}>
          {member.username} (Member)
          {groupDetails.owner === member._id && ' - Owner'}
          {member.isModerator && ' - Moderator'}
        </li>
      ))}
    </ul>

    {/* Join Group or Leave Group button */}
    <button onClick={handleJoinOrLeaveGroup}>
      {isMember ? 'Leave Group' : 'Join Group'}
    </button>

    {/* Only show additional actions for group owners */}
    {groupDetails.owner === currentUser._id && (
      <div>
        {/* Transfer ownership */}
        <button onClick={handleTransferOwnership}>Transfer Ownership</button>
      </div>
    )}

    {/* Display members list and actions for owners and moderators */}
    <ul>
      {groupDetails.members.map((member) => (
        <li key={member._id}>
          {member.username} (Member)
          {groupDetails.owner === member._id && ' - Owner'}
          {member.isModerator && ' - Moderator'}

          {/* Only show actions for owners */}
          {groupDetails.owner === currentUser._id && (
            <>
              <button onClick={() => handleKickMember(member._id)}>Kick</button>
              {!member.isModerator && <button onClick={() => handlePromoteMember(member._id)}>Promote</button>}
              {member.isModerator && <button onClick={() => handleDemoteMember(member._id)}>Demote</button>}
            </>
          )}
        </li>
      ))}
    </ul>

    {/* Display chat messages */}
    <div>
  {chatMessages.length === 0 ? <p>No messages</p> : (
    chatMessages.map((message, index) => (
      <div key={index}>
        <p>{message.sender}: {message.text}</p>
      </div>
    ))
   )}
    </div>
  {/* Input field and button for sending messages */}
    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
    <button onClick={handleSendMessage}>Send Message</button>
  </div>
 );

};

export default GamingGroupDetails;
