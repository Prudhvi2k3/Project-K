// frontend/admin/project.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState('');
    const [oneLineDescription, setOneLineDescription] = useState('');
    const [largeDescription, setLargeDescription] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [images, setImages] = useState([]);
    const [editingProjectId, setEditingProjectId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/project');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleFileChange = (event) => {
        setImages(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('oneLineDescription', oneLineDescription);
        formData.append('largeDescription', largeDescription);
        formData.append('githubLink', githubLink);
        Array.from(images).forEach((file, index) => {
            formData.append('images', file);
        });

        try {
            if (editingProjectId) {
                await axios.put(`http://localhost:5000/project/${editingProjectId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setEditingProjectId(null);
            } else {
                await axios.post('http://localhost:5000/project', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            fetchProjects();
            resetForm();
        } catch (error) {
            console.error(`Error ${editingProjectId ? 'updating' : 'creating'} project:`, error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setOneLineDescription('');
        setLargeDescription('');
        setGithubLink('');
        setImages([]);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/project/${id}`);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleEdit = (project) => {
        setTitle(project.title);
        setOneLineDescription(project.oneLineDescription);
        setLargeDescription(project.largeDescription);
        setGithubLink(project.githubLink || '');
        setImages([]);
        setEditingProjectId(project._id);
    };

    const renderImages = (images) => {
        return images.map((image, index) => {
            const base64String = btoa(
                new Uint8Array(image.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return (
                <img
                    key={index}
                    src={`data:image/jpeg;base64,${base64String}`}
                    alt={`Project ${index}`}
                    width="100"
                />
            );
        });
    };

    return (
        <div>
            <h1>Projects</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>One Line Description:</label>
                    <input
                        type="text"
                        value={oneLineDescription}
                        onChange={(e) => setOneLineDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Large Description:</label>
                    <textarea
                        value={largeDescription}
                        onChange={(e) => setLargeDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label>GitHub Link:</label>
                    <input
                        type="text"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                    />
                </div>
                <div>
                    <label>Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">{editingProjectId ? 'Update' : 'Create'} Project</button>
            </form>

            <h2>Existing Projects</h2>
            <ul>
                {projects.map((project) => (
                    <li key={project._id}>
                        <h3>{project.title}</h3>
                        <p>{project.oneLineDescription}</p>
                        <p>{project.largeDescription}</p>
                        {project.githubLink && (
                            <p>GitHub: <a href={project.githubLink} target="_blank" rel="noopener noreferrer">{project.githubLink}</a></p>
                        )}
                        <div>
                            {renderImages(project.images)}
                        </div>
                        <button onClick={() => handleEdit(project)}>Edit</button>
                        <button onClick={() => handleDelete(project._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectPage;