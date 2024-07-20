import { useState, useRef } from "react";
import { FaBars, FaTimes, FaAngleDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../img/khub logo.png";


function Navbar() {
  const navRef = useRef();
  const [activeLink, setActiveLink] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);


  const showNavbar = () => {
    setIsNavOpen(!isNavOpen);
    navRef.current.classList.toggle("responsive_nav");
  };


  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsNavOpen(false);
    setIsAboutDropdownOpen(false);
    navRef.current.classList.remove("responsive_nav");
  };


  const toggleAboutDropdown = (e) => {
    e.preventDefault();
    setIsAboutDropdownOpen(!isAboutDropdownOpen);
  };


  return (
    <header>
      <img src={logo} alt="Logo" className="logo" />
      <nav ref={navRef}>
        <Link
          to="/"
          className={activeLink === "Home" ? "active" : ""}
          onClick={() => handleLinkClick("Home")}
        >
          Home
        </Link>
        <div className="dropdown">
          <div
            className={activeLink === "About Us" ? "active" : ""}
            onClick={toggleAboutDropdown}
            style={{ cursor: "pointer" }}
          >
            About Us <FaAngleDown />
          </div>
          <div className={`dropdown-content ${isAboutDropdownOpen ? "show" : ""}`}>
            <Link
              to="/teamnew"
              className={activeLink === "Teams" ? "active" : ""}
              onClick={() => handleLinkClick("Teams")}
            >
              OurTeam
            </Link>
            <Link
              to="/passedout"
              className={activeLink === "Batch" ? "active" : ""}
              onClick={() => handleLinkClick("Batch")}
            >
              Batch
            </Link>
            <Link
              to="/alumni"
              className={activeLink === "Alumni" ? "active" : ""}
              onClick={() => handleLinkClick("Alumni")}
            >
              Alumni
            </Link>
          </div>
        </div>
        <Link
          to="/event-gallery"
          className={activeLink === "Events" ? "active" : ""}
          onClick={() => handleLinkClick("Events")}
        >
          Events
        </Link>
        <Link
          to="/ourwork"
          className={activeLink === "Our Work" ? "active" : ""}
          onClick={() => handleLinkClick("Our Work")}
        >
          Our Work
        </Link>
        <Link
          to="/blogs"
          className={activeLink === "Blogs" ? "active" : ""}
          onClick={() => handleLinkClick("Blogs")}
        >
          Blogs
        </Link>
        <Link
          to="/contact"
          className={activeLink === "Contact Us" ? "active" : ""}
          onClick={() => handleLinkClick("Contact Us")}
        >
          Contact Us
        </Link>
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}


export default Navbar;