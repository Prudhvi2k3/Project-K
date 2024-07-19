import React from 'react';
import './Footer.css';
import logo from '../img/logo.png';
import logo2 from '../img/logo2.png';
import logo3 from '../img/logo3.png';
import mailIcon from '../img/maillogo.png';
import whatsapp from '../img/whats.png';
import youtube from '../img/yt.png';
import linkedin from '../img/linkd.png';
import instagram from '../img/inst.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section footer-logo-section">
        <div className="footer-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="social-icons">
          <a href="https://whatsapp.com/channel/0029VadjV9a5K3zXVQlbLS1f"><img src={whatsapp} alt="WhatsApp" /></a>
          <a href="https://youtube.com/@kiet-hub?si=KJRjQOSO-LxVUk3p"><img src={youtube} alt="YouTube" /></a>
          <a href="https://www.linkedin.com/company/khub-kiet/"><img src={linkedin} alt="LinkedIn" /></a>
          <a href="https://www.instagram.com/khub_kiet?igsh=aW1rZXNodnBuYzM3"><img src={instagram} alt="Instagram" /></a>
        </div>
      </div>
      <div className="footer-section quick-links">
        <h3>Our Links</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="event-gallery">Events</a></li>
          <li><a href="ourwork">Our Work</a></li>
          <li><a href="blogs">Blogs</a></li>
          <li><a href="contact">Contact Us</a></li>
        </ul>
      </div>
      <div className="footer-section contact-us">
        <h3>Contact Us</h3>
        <p>K-Hub Work Space, B-block Kakinada Institute of Engineering & Technology. Korangi, Andhra Pradesh, INDIA, 533461.<br />
        </p>
        <p>
        <a href="mailto:khub.kiet@gmail.com"><img src={mailIcon} alt="Mail" className="mail-icon" /></a> khub.kiet@gmail.com
        </p>
      </div>
      <div className="footer-section footer-logos">
        <img src={logo2} alt="Logo2" className="partner-logo2" />
        <img src={logo3} alt="Logo3" className="partner-logo3" />
      </div>
      <div className="footer-copyright">
        <p>&copy; 2022 K-HUB (Kiet-Hub). All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
