import React, { useState } from "react";
import { searchGroups } from "../api";
import { Link } from "react-router-dom";

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
    <div>
      <h2>Search Groups</h2>
      <input
        type="text"
        placeholder="Search groups"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>

      {searchResults.map((group) => (
        <div key={group._id}>
          <Link to={`/groups/${group._id}`}>
            <span>{group.name}</span>
          </Link>
          <p>Members: {group.members.length}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchGroups;
