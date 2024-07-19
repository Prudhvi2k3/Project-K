import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Upload, Typography, message, Modal, Row, Col, Card, Form } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { confirm } = Modal;
const { Meta } = Card;

// Function to convert ArrayBuffer to Base64 string
const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

const AchievementsManager = () => {
    const [achievements, setAchievements] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await axios.get('https://project-k-s2nr.onrender.com/achievement');
            setAchievements(response.data);
        } catch (error) {
            console.error('Error fetching achievements:', error);
            message.error('Error fetching achievements');
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
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('number', values.number);
            if (values.image && values.image.fileList.length > 0) {
                formData.append('image', values.image.fileList[0].originFileObj);
            }
    
            if (isEditing) {
                console.log(`PUT Request URL: https://project-k-s2nr.onrender.com/achievement/${editingId}`);
                const response = await axios.put(`https://project-k-s2nr.onrender.com/achievement/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                const updatedAchievement = response.data;
                setAchievements(prevAchievements => 
                    prevAchievements.map(ach => 
                        ach._id === editingId ? updatedAchievement : ach
                    )
                );
                message.success('Achievement updated successfully');
            } else {
                console.log('POST Request URL: https://project-k-s2nr.onrender.com/achievement');
                await axios.post('https://project-k-s2nr.onrender.com/achievement', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Achievement added successfully');
            }
            setIsModalVisible(false);
            fetchAchievements();
        } catch (error) {
            console.error('Error saving achievement:', error);
            message.error('Error saving achievement');
        }
    };
    
    const startEditing = (achievement) => {
        setIsEditing(true);
        setEditingId(achievement._id);
        setIsModalVisible(true);
        form.setFieldsValue({
            title: achievement.title,
            number: achievement.number,
        });
    };

    const handleDelete = async (id) => {
        try {
            console.log(`DELETE Request URL: https://project-k-s2nr.onrender.com/achievement/${id}`);
            await axios.delete(`https://project-k-s2nr.onrender.com/achievement/${id}`);
            setAchievements(achievements.filter(ach => ach._id !== id));
            message.success('Achievement deleted successfully');
        } catch (error) {
            console.error('Error deleting achievement:', error);
            message.error('Error deleting achievement');
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Are you sure you want to delete this achievement?',
            onOk() {
                handleDelete(id);
            },
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
                <Col>
                    <Title level={2}>Achievements</Title>
                </Col>
            </Row>
            <Row justify="center" style={{ marginBottom: '20px' }}>
                <Col>
                    <Button type="primary" onClick={showModal}>
                        Add Achievement
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                {achievements.map((achievement) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={achievement._id}>
                        <Card
                            cover={achievement.image && (
                                <img
                                    alt={achievement.title}
                                    src={`data:image/jpeg;base64,${arrayBufferToBase64(achievement.image.data)}`}
                                    style={{ height: 200, objectFit: 'cover' }}
                                />
                            )}
                            actions={[
                                <Button icon={<EditOutlined />} onClick={() => startEditing(achievement)} />,
                                <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(achievement._id)} />,
                            ]}
                        >
                            <Meta
                                title={achievement.title}
                                description={`Number: ${achievement.number}`}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title={isEditing ? "Edit Achievement" : "Add Achievement"}
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
                        name="number"
                        label="Number"
                        rules={[{ required: true, message: 'Please input the number!' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Image"
                        valuePropName="file"
                    >
                        <Upload
                            beforeUpload={() => false}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Select Image</Button>
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

export default AchievementsManager;
