import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const Header = () => {
  return (
    <header className="navbar py-10 p-3">
      <h1>Aditya's Calculator</h1>
      <div className="future-updates-dropdown">
        <button>Future Updates</button>
        <div className="dropdown-content">
          <p>New feature will be added soon</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
