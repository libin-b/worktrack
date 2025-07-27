import "./Topbar.css";
import { FaBell,FaSearch } from 'react-icons/fa';
import userImage from '../../assets/images/user.png';

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="search-box">
        <FaSearch className=" search-icon" />
        <input type="text" placeholder="Search" />
      </div>
      <div className="topbar-right">
        <div className="icon-wrapper" >
          <FaBell className="icon" />
        </div>

        <div className="profile-wrapper" >
          <img src={userImage} alt="User" className="profile-img" />
        </div>
      </div>
    </header>
  );
}
