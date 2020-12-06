import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import NotificationsIcon from "@material-ui/icons/Notifications";

import LanguageIcon from "@material-ui/icons/Language";
import Avatar from "@material-ui/core/Avatar";
import SearchIcon from "@material-ui/icons/Search";
import Logo from "../images/logo.jpeg";
import "../StyleSheet/Header.css";
const Header = ({ profile }) => {
  const location = window.location.href;

  return (
    <div className="Header">
      <div className="Header__left">
        <div className="left__logo">
          <img src={Logo} alt="Company Logo" className="left__logoImage" />
        </div>
        <div
          className={`left__Home ${
            location === "http://localhost:3000/" ? "current-location" : null
          }`}
        >
          <HomeIcon />
          <h4>Home</h4>
        </div>
        <div
          className={`left__notifications ${
            location === "http://localhost:3000/notifications"
              ? "current-location"
              : null
          }`}
        >
          <NotificationsIcon />
          <h4>Notifications</h4>
        </div>
      </div>
      <div className="Header__center">
        <input
          type="text"
          placeholder="Search"
          className="center__inputField"
        />
        <SearchIcon />
      </div>
      <div className="Header__right">
        <div className="right__user">
          <Avatar src={profile} alt="User Profile" />
        </div>
        <LanguageIcon className="right__Icon" />
        <button className="right-btn">Add Question</button>
      </div>
    </div>
  );
};

export default Header;
