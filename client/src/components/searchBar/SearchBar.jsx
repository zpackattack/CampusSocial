import { useState } from "react";
import axios from "axios";

import "./SearchBar.css";

export const SearchBar = ({ setResults, setSelectedUniversity, inputs }) => {
  const [input, setInput] = useState(inputs);

  const fetchData = async (value) => {
    try {
        const response = await axios.get(
          `http://localhost:8800/api/university/get?name=${value}`
        );
        console.log(response.data);
        setResults(response.data);
      } catch (err) {
        console.error("Error searching universities:", err);
        setResults([]);
      }
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <input
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
