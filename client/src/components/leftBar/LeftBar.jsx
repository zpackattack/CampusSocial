import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {

  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
        <Link to={`/profile`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="user">
            <img
              src={"/upload/" +currentUser.profilePic}
              alt=""
            />
            <span>{currentUser.name}</span>
          </div>
          </Link>
          <Link to={`/university/${currentUser.universityID}`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src={Friends} alt="" />
            <span>University</span>
          </div>
          </Link>
          <Link to={`/userRSOs`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src={Groups} alt="" />
            <span>Joined RSOs</span>
          </div>
          </Link>
          <Link to={`/allRSOs`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src={Market} alt="" />
            <span>Explore RSOs</span>
          </div>
          </Link>
          {/*
          <div className="item">
            <img src={Watch} alt="" />
            <span>Watch</span>
          </div>
          <div className="item">
            <img src={Memories} alt="" />
            <span>Memories</span>
          </div>
  */}
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <Link to={`/createRSO`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src={Fund} alt="" />
            <span>Create RSO</span>
          </div>
          </Link>
          <Link to={`/yourRSORequests`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src={Gaming} alt="" />
            <span>Your RSO Requests</span>
          </div>
          </Link>
          <Link to={`/EventPortal`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src={Gallery} alt="" />
            <span>Event Portal</span>
          </div>
          </Link>
          <Link to={`/RSORequests`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src={Gallery} alt="" />
            <span>RSO Request Portal</span>
          </div>
          </Link>
          <Link to={`/UniversityRequests`} style={{ textDecoration: 'none', color: 'inherit' }}> 
          <div className="item">
            <img src={Videos} alt="" />
            <span>University Request Portal</span>
          </div>
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default LeftBar;
