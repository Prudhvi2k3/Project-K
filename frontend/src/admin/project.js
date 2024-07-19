import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Upload, Typography, message, Modal, Row, Col, Card, Form } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;
const { Meta } = Card;

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
          const response = await axios.get('https://project-k-s2nr.onrender.com/project');
          const sortedProjects = response.data.sort((a, b) => b._id.localeCompare(a._id));
          setProjects(sortedProjects);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };

    const showModal = () => {
        setIsModalVisible(true);
        setIsEditing(false);
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setEditingId(null);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('oneLineDescription', values.oneLineDescription);
        formData.append('largeDescription', values.largeDescription);
        formData.append('githublink', values.githublink);
        
        // Handle image files
        if (values.images) {
            values.images.forEach((file) => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                } else {
                    formData.append('existingImages', file.url);
                }
            });
        }

        try {
            if (isEditing) {
                await axios.put(`https://project-k-s2nr.onrender.com/project/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Project updated successfully');
            } else {
                await axios.post('https://project-k-s2nr.onrender.com/project', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Project added successfully');
            }
            setIsModalVisible(false);
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            message.error('Error saving project');
        }
    };

    const startEditing = (project) => {
        setIsEditing(true);
        setEditingId(project._id);
        setIsModalVisible(true);
        form.setFieldsValue({
            title: project.title,
            oneLineDescription: project.oneLineDescription,
            largeDescription: project.largeDescription,
            githublink: project.githublink,
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://project-k-s2nr.onrender.com/project/${id}`);
            setProjects(projects.filter(project => project._id !== id));
            message.success('Project deleted successfully');
        } catch (error) {
            console.error('Error deleting project:', error);
            message.error('Error deleting project');
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Are you sure you want to delete this project?',
            onOk() {
                handleDelete(id);
            },
        });
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const renderImages = (images) => {
        return images.map((image, index) => {
            const base64String = arrayBufferToBase64(image.data);
            return (
                <img
                    key={index}
                    src={`data:${image.contentType};base64,${base64String}`}
                    alt={`Project ${index}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                />
            );
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
                <Col>
                    <Title level={2}>Projects</Title>
                </Col>
            </Row>
            <Row justify="center" style={{ marginBottom: '20px' }}>
                <Col>
                    <Button type="primary" onClick={showModal}>
                        Add Project
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                {projects.map((project) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={project._id}>
                        <Card
                            cover={project.images && project.images.length > 0 && (
                                <img
                                    alt={project.title}
                                    src={`data:${project.images[0].contentType};base64,${arrayBufferToBase64(project.images[0].data)}`}
                                    style={{ height: 200, objectFit: 'cover' }}
                                />
                            )}
                            actions={[
                                <Button icon={<EditOutlined />} onClick={() => startEditing(project)} />,
                                <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(project._id)} />,
                            ]}
                        >
                            <Meta
                                title={project.title}
                                description={project.oneLineDescription}
                            />
                            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                {project.largeDescription}
                            </Paragraph>
                            <div>{renderImages(project.images)}</div>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title={isEditing ? "Edit Project" : "Add Project"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input the title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="oneLineDescription"
                        label="One Line Description"
                        rules={[{ required: true, message: 'Please input the one line description!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="largeDescription"
                        label="Large Description"
                        rules={[{ required: true, message: 'Please input the large description!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        name="githublink"
                        label="GitHub Link"
                        rules={[{ required: true, message: 'Please input the GitHub link!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="images"
                        label="Images"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                    >
                        <Upload
                            beforeUpload={() => false}
                            multiple
                            listType="picture-card"
                        >
                            <Button icon={<UploadOutlined />}>Upload Images</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? 'Update' : 'Add'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectPage;
