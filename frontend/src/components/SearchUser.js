import React, { useState } from "react";
import { searchFriends } from "../api";
import { Link } from "react-router-dom";
import "../styles/SearchUser.css";

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
    <div className="search-user-component">
      <h2 className="search-user-title">Search Friends</h2>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search friends"
          value={searchQuery}
          onChange={handleInputChange}
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="search-results">
        {searchResults.map((friend) => (
          <Link
            key={friend._id}
            to={`/profile/${friend._id}`}
            className="friend-result-link"
          >
            <div className="friend-result">
              <img
                src={friend.avatar}
                alt={friend.username}
                className="friend-avatar"
              />
              <span className="friend-username">{friend.username}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchUser;
