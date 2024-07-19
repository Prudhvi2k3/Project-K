import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './EventGallery.css';

const api = axios.create({
  baseURL: 'https://project-k-s2nr.onrender.com/',
});

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

function EventGalleryPage() {
  const [events, setEvents] = useState([]);
  const [photoGalleryItems, setPhotoGalleryItems] = useState([]);
  const [photoGalleryImages, setPhotoGalleryImages] = useState([]);
  const [selectedSection, setSelectedSection] = useState('whats-new');
  const [popupContent, setPopupContent] = useState(null);
  const [popupImages, setPopupImages] = useState([]);
  const [randomImage, setRandomImage] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get('/event');
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  }, []);

  const fetchPhotoGalleryItems = useCallback(async () => {
    try {
      const response = await api.get('/photo-gallery');
      setPhotoGalleryItems(response.data);
    } catch (err) {
      console.error('Error fetching photo gallery items:', err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchPhotoGalleryItems();
  }, [fetchEvents, fetchPhotoGalleryItems]);

  useEffect(() => {
    if (photoGalleryItems.length > 0) {
      const allImages = photoGalleryItems.flatMap(item => item.images.map(image => arrayBufferToBase64(image.data)));
      setPhotoGalleryImages(allImages);
      if (allImages.length > 0) {
        setRandomImage(allImages[Math.floor(Math.random() * allImages.length)]);
      }
    }
  }, [photoGalleryItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (photoGalleryImages && photoGalleryImages.length > 0) {
        const randomIndex = Math.floor(Math.random() * photoGalleryImages.length);
        setRandomImage(photoGalleryImages[randomIndex]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [photoGalleryImages]);

  const currentDate = new Date();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const sortedEvents = events.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
  const whatsNewItems = sortedEvents.filter(item => new Date(item.eventDate) < currentDate);
  const upcomingEventsItems = sortedEvents.filter(item => new Date(item.eventDate) >= currentDate);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setPopupContent(null);
    setPopupImages([]);
  };

  const handleItemClick = (item) => {
    setPopupContent(item);
  };

  const handleImageClick = (images) => {
    setPopupImages(images);
  };

  const handleClosePopup = () => {
    setPopupContent(null);
    setPopupImages([]);
  };

  const renderEventList = (events) => {
    return (
      <div className="eg-event-list">
        {events.map((item) => (
          <div key={item._id} className="eg-event-item" onClick={() => handleItemClick(item)}>
            <strong>{item.title}</strong>
            <p>{item.smallDescription}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="eg-container">
      <div className="eg-random-image">
        {randomImage && (
          <img 
            src={`data:image/jpeg;base64,${randomImage}`} 
            alt="Random Gallery" 
          />
        )}
      </div>

      <div className="eg-selection-pane">
        <div className="eg-section-buttons">
          <button 
            className={`eg-section-button ${selectedSection === 'whats-new' ? 'eg-section-button-active' : ''}`} 
            onClick={() => handleSectionClick('whats-new')}
          >
            What's New
          </button>
          <button 
            className={`eg-section-button ${selectedSection === 'upcoming-events' ? 'eg-section-button-active' : ''}`} 
            onClick={() => handleSectionClick('upcoming-events')}
          >
            Upcoming Events
          </button>
          <button 
            className={`eg-section-button ${selectedSection === 'photo-gallery' ? 'eg-section-button-active' : ''}`} 
            onClick={() => handleSectionClick('photo-gallery')}
          >
            Photo Gallery
          </button>
        </div>

        <div className="eg-section-content">
          {selectedSection === 'whats-new' && (
            <div>
              {renderEventList(whatsNewItems)}
            </div>
          )}

          {selectedSection === 'upcoming-events' && (
            <div>
              {renderEventList(upcomingEventsItems)}
            </div>
          )}

          {selectedSection === 'photo-gallery' && (
            <div>
              <div className="eg-event-list">
                {photoGalleryItems.map((item) => (
                  <div key={item._id} className="eg-event-item" onClick={() => handleImageClick(item.images)}>
                    <strong>{item.title}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {popupContent && (
            <div className="eg-popup">
              <div className="eg-popup-content">
                <span className="eg-popup-close" onClick={handleClosePopup}>&times;</span>
                <h3>{popupContent.title}</h3>
                <p>{popupContent.smallDescription}</p>
                <p>{popupContent.longDescription}</p>
                <p>Event Date : {formatDate(popupContent.eventDate)}</p>
                {popupContent.image && (
                  <img 
                    src={`data:image/jpeg;base64,${arrayBufferToBase64(popupContent.image.data)}`} 
                    alt={popupContent.title}
                    className="eg-event-card-image"
                  />
                )}
              </div>
            </div>
          )}

          {popupImages.length > 0 && (
            <div className="eg-popup">
              <div className="eg-popup-content">
                <span className="eg-popup-close" onClick={handleClosePopup}>&times;</span>
                {popupImages.map((image, index) => (
                  <img 
                    key={index}
                    src={`data:image/jpeg;base64,${arrayBufferToBase64(image.data)}`} 
                    alt={`Gallery - ${index + 1}`} 
                    className="eg-popup-image"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventGalleryPage;
