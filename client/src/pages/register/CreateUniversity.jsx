import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CreateUniversity.scss";
import axios from "axios";
import { SearchBar } from "../../components/searchBar/SearchBar";
import { SearchResultsList } from "../../components/searchBar/SearchResultsList";
import CreateUniversityForm from "../../components/update/CreateUniversityForm";



const CreateUniversity = () => {


  return (
    <div className="createUniversity">
      <div className="card">
      <CreateUniversityForm />
      </div>
    </div>
  );
};

export default CreateUniversity;
