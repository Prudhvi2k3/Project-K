import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Modal } from 'antd';
import './HomeBlog.css';

const NavItem = ({ text, isActive, onClick }) => (
  <li className={isActive ? 'active' : ''} onClick={onClick}>{text}</li>
);

const BlogCard = ({ image, title, description, date, youtubeLink, onClick, isNewsletter }) => (
  <div className="project-card">
    {!isNewsletter && (
    <div className="image-container">
      {image ? (
        <img
          src={`data:image/jpeg;base64,${arrayBufferToBase64(image.data)}`}
          alt={title}
        />
      ) : (
        <img
          src="default-image.jpg"
          alt={title}
        />
      )}
    </div>
    )}
    <h3>{title}</h3>
    <p className="date">{moment(date).format('MMMM Do YYYY')}</p>
    <p>{description}</p>
    {youtubeLink && (
      <p>
        <a href={youtubeLink} target="_blank" rel="noopener noreferrer">Watch Video</a>
      </p>
    )}
    <button onClick={onClick}>Read More</button>
  </div>
);

function HomeBlog() {
  const [blogs, setBlogs] = useState([]);
  const [blogType, setBlogType] = useState('NewsLetter');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await axios.get(`https://project-k-s2nr.onrender.com/blogs/${blogType}`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }, [blogType]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleNavClick = (type) => {
    setBlogType(type);
    setSelectedBlog(null);
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setModalVisible(true);
  };

  const viewPDF = (file) => {
    const base64Data = arrayBufferToBase64(file.data);
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const renderContent = () => {
    if (blogType === 'NewsLetter') {
      return (
        <table className="newsletter-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog._id}>
                <td>{moment(blog.date).format('MMMM Do YYYY')}</td>
                <td>{blog.title}</td>
                <td>{blog.shortDescription}</td>
                <td>
                  <button onClick={() => handleBlogClick(blog)}>Read More</button>
                  {blog.files && blog.files.length > 0 && (
                    <button onClick={() => viewPDF(blog.files[0])}>View PDF</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <div className="project-grid">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              image={blog.files && blog.files.length > 0 ? blog.files[0] : null}
              title={blog.title}
              description={blog.shortDescription}
              date={blog.date}
              youtubeLink={blog.youtubeLink}
              onClick={() => handleBlogClick(blog)}
              isNewsletter={false}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="App">
      <div className="rectangular-nav-container">
        <nav className="rectangular-nav">
          <ul>
            <NavItem text="News Letter" isActive={blogType === 'NewsLetter'} onClick={() => handleNavClick('NewsLetter')} />
            <NavItem text="FMML" isActive={blogType === 'FMML'} onClick={() => handleNavClick('FMML')} />
            <NavItem text="Workshops" isActive={blogType === 'Workshops'} onClick={() => handleNavClick('Workshops')} />
            <NavItem text="Webinars" isActive={blogType === 'Webinars'} onClick={() => handleNavClick('Webinars')} />
            <NavItem text="Contests" isActive={blogType === 'Contests'} onClick={() => handleNavClick('Contests')} />
          </ul>
        </nav>
      </div>

      {renderContent()}

      <Modal
  visible={modalVisible}
  onCancel={() => setModalVisible(false)}
  footer={null}
  width="80%"
  style={{ maxWidth: '800px' }}
>
  {selectedBlog && (
    <div className="blog-details">
      <h2>{selectedBlog.title}</h2>
      <h3>Date: {moment(selectedBlog.date).format('MMMM Do YYYY')}</h3>
      {blogType !== 'NewsLetter' && selectedBlog.files && selectedBlog.files.length > 0 && (
        <img 
          src={`data:image/jpeg;base64,${arrayBufferToBase64(selectedBlog.files[0].data)}`} 
          alt={selectedBlog.title}
          className="blog-image"
        />
      )}
      <p>{selectedBlog.shortDescription}</p>
      <p>{selectedBlog.longDescription}</p>
      {selectedBlog.youtubeLink && (
        <p>
          <strong>Watch Webinar Recording :</strong>
          <a href={selectedBlog.youtubeLink} target="_blank" rel="noopener noreferrer">Watch Video</a>
        </p>
      )}
      {blogType === 'NewsLetter' && selectedBlog.files && selectedBlog.files.length > 0 && (
        <button onClick={() => viewPDF(selectedBlog.files[0])}>View PDF</button>
      )}
    </div>
  )}
</Modal>
    </div>
  );
}

// Utility function to convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export default HomeBlog;