import React, { useState } from "react";
import { searchGroups } from "../api";
import { Link } from "react-router-dom";
import "../styles/SearchGroups.css";

const SearchGroups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await searchGroups({ keyword: searchQuery });
      setSearchResults(response);
    } catch (error) {
      console.error("Error searching groups:", error);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-groups-container">
      <h2 className="search-groups-heading">Search Groups</h2>
      <div className="search-input">
        <input
          type="text"
          placeholder="Search groups"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {searchResults.map((group) => (
        <div key={group._id} className="search-result">
          <Link to={`/groups/${group._id}`} className="group-link">
            <span className="group-name">{group.name}</span>
          </Link>
          <p className="members-count">Members: {group.members.length}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchGroups;
