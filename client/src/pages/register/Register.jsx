import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { SearchBar } from "../../components/searchBar/SearchBar";
import { SearchResultsList } from "../../components/searchBar/SearchResultsList";



const Register = () => {
  const navigate = useNavigate();
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
          `http://localhost:8800/api/university/?name=${searchTerm}`
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
    console.log("Uni", university.name);
    setUniversities([]);
    setShowDropdown(false);
    
    // Add the following line to update the input field with the selected university name
    setResults([{ name: university.name }]); // This will update the search results with the selected university name
    console.log(results.name);
    setInput(university.name)
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      navigate("/login");
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
            Don't wait to join the all you can club hub for RSO's in your college. Register today!
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>

          <div style={{ textAlign: "center" }}>
            <Link to="/createUniversity" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>To apply to create a university, click here</h3>
            </Link>
          </div>
          
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
