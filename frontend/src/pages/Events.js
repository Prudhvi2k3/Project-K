// src/pages/Events.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Events.css';

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const EventCard = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/event');
        const fetchedEvents = response.data;

        const sortedEvents = fetchedEvents.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate)).slice(0, 3);

        const eventsWithImages = sortedEvents.map(event => ({
          ...event,
          imageUrl: `data:image/jpeg;base64,${arrayBufferToBase64(event.image.data)}`
        }));

        setEvents(eventsWithImages);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const openModal = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="events-container">
      <div className='event'><h1>Events</h1></div>
      <div className="events-list">
        {events.map((event) => (
          <div className="event-card" key={event._id}>
            <img src={event.imageUrl} alt={event.title} />
            <div className="event-details">
              <h2>{event.title}</h2>
              <p>{event.smallDescription}</p>
              <button onClick={() => openModal(event)} className="read-more">Read More</button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="modal" onClick={closeModal}>
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="modal-image"/>
            <h2>{selectedEvent.title}</h2>
            <p>{/*<strong>Small Description:</strong> */}{selectedEvent.smallDescription}</p>
            <p>{/*<strong>Long Description:</strong> */}{selectedEvent.longDescription}</p>
            <p>{/*<strong>Date:</strong> */}{new Date(selectedEvent.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
            <a className="more-events" href="event-gallery">More Events</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
