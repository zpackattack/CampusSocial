import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { SearchBar } from "../../components/searchBar/SearchBar";
import { SearchResultsList } from "../../components/searchBar/SearchResultsList";


const Register = () => {
  const [inputs, setInputs] = useState({
    name: "",
    username: "",
    password: "",
    userType: 0,
    universityID: 0, // This will store the ID of the selected university
  });
  const [err, setErr] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/universities?name=${searchTerm}`
        );
        setUniversities(response.data);
        setShowDropdown(true);
      } catch (err) {
        console.error("Error searching universities:", err);
        setUniversities([]);
        setShowDropdown(false);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchUniversities();
    } else {
      setUniversities([]);
      setShowDropdown(false);
    }
  }, [searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setSearchTerm(value.trim());
  };

  const handleUniversitySelection = (university) => {
    setInputs((prev) => ({
      ...prev,
      universityID: university.universityID, // Assuming universityID is the ID of the selected university
    }));
    console.log(inputs);
    setUniversities([]);
    setShowDropdown(false);
    console.log(results);
    // Add the following line to update the input field with the selected university name
    setResults([{ name: university.name }]); // This will update the search results with the selected university name
    setInput(university.name)
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Campus Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="username"
              value={inputs.username}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
            <SearchBar setResults={setResults} input = {input}/>
            {results && results.length > 0 && <SearchResultsList results={results} handleUniversitySelection={handleUniversitySelection} />}

            {err && <div className="error">{err}</div>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
