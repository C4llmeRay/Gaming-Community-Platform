import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupDetails } from '../api';

const GroupDetails = () => {
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await getGroupDetails(groupId);
        setGroupDetails(response);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  if (!groupDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
    </div>
  );
};

export default GroupDetails;
