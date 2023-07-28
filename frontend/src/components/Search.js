import React, { useState } from "react";
import { searchGroups, searchFriends, searchGamingSessions } from "../api";

const Search = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    keyword: "",
    type: "groups", 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      let searchResults;
      if (searchCriteria.type === "groups") {
        searchResults = await searchGroups({ keyword: searchCriteria.keyword });
      } else if (searchCriteria.type === "friends") {
        searchResults = await searchFriends({
          keyword: searchCriteria.keyword,
        });
      } else if (searchCriteria.type === "sessions") {
        searchResults = await searchGamingSessions({
          keyword: searchCriteria.keyword,
        });
      }

      console.log("Search Results:", searchResults);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div>
      <h2>Search</h2>
      <select
        name="type"
        value={searchCriteria.type}
        onChange={handleInputChange}
      >
        <option value="groups">Gaming Groups</option>
        <option value="friends">Friends</option>
        <option value="sessions">Gaming Sessions</option>
      </select>
      <input
        type="text"
        name="keyword"
        placeholder="Enter your search keyword"
        value={searchCriteria.keyword}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;
