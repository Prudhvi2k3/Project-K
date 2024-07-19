// src/components/user/Contact.js
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faEnvelopeOpen, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import Img from '../img/cont1.jpg';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/contact/send', formData);
      console.log(response.data);
      toast.success('Message sent successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
      });
    } catch (error) {
      console.error('There was an error sending the email!', error);
      toast.error('Error sending message. Please try again later.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <section className="contact-section">
      <ToastContainer />
      <div className="contact-bg">
        <h3>Get in Touch with Us</h3>
        <h2>Contact Us</h2>
        <div className="line">
          <div></div>
          <div></div>
          <div></div>
        </div>
        {/* <p className="text">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda iste facilis quos impedit fuga nobis modi debitis laboriosam velit reiciendis quisquam alias corporis, maxime enim, optio ab dolorum sequi qui.
        </p> */}
      </div>

      <div className="contact-body">
        <div className="contact-info">
          <div>
            <span><FontAwesomeIcon icon={faMobileAlt} /></span>
            <span>Phone No.</span>
            <span className="text">+91 96189 13711</span>
          </div>
          <div>
            <span><FontAwesomeIcon icon={faEnvelopeOpen} /></span>
            <span>E-mail</span>
            <span className="text">khub.kiet@gmail.com</span>
          </div>
          <div>
            <span><FontAwesomeIcon icon={faMapMarkerAlt} /></span>
            <span>Location</span>
            <span className="text">
              K-Hub(Kiet-Hub), B-block<br />
              Kakinada Institute of Engineering & Technology.<br />
              Korangi, 533461<br />
              Andhra Pradesh, INDIA
            </span>
          </div>
          <div>
            <span><FontAwesomeIcon icon={faClock} /></span>
            <span>Opening Hours</span>
            <span className="text">Monday - Friday (9:00 AM to 4:00 PM)</span>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="email" 
                className="form-control" 
                placeholder="E-mail" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Subject" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="tel" 
                className="form-control" 
                placeholder="Phone" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <textarea 
              rows="5" 
              placeholder="Message" 
              className="form-control" 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              required
            ></textarea>
            <button type="submit" className="send-btn">Send Message</button>
          </form>

          <div>
            <img src={Img} alt="Contact" />
          </div>
        </div>
      </div>

      <div className="map">
        <iframe 
          title="Kiet College Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.280963727645!2d82.23772427387453!3d16.812412083979968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a38205e52dbce3d%3A0x794aa1538de4100f!2sKiet%20College!5e0!3m2!1sen!2sin!4v1719987794883!5m2!1sen!2sin" 
          width="100%" 
          height="350" 
          style={{border:0}} 
          allowFullScreen="" 
          aria-hidden="false" 
          tabIndex="0"
        ></iframe>
      </div>
    </section>
  );
};

export default Contact;