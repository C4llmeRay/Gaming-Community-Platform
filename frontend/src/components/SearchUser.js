import React, { useState } from "react";
import { searchFriends } from "../api";
import { Link } from "react-router-dom";

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await searchFriends({ keyword: searchQuery });
      setSearchResults(response);
    } catch (error) {
      console.error("Error searching friends:", error);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <h2>Search Friends</h2>
      <input
        type="text"
        placeholder="Search friends"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>

      {searchResults.map((friend) => (
        <div key={friend._id}>
          <Link to={`/profile/${friend._id}`}>
            <img src={friend.avatar} alt={friend.username} />
            <span>{friend.username}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchUser;
