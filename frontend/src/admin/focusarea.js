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

const FocusAreasManager = () => {
    const [focusAreas, setFocusAreas] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchFocusAreas();
    }, []);

    const fetchFocusAreas = async () => {
        try {
            const response = await axios.get('https://project-k-s2nr.onrender.com/focusarea');
            const sortedFocusAreas = response.data.sort((a, b) => b._id.localeCompare(a._id));
            setFocusAreas(sortedFocusAreas);
  } catch (error) {
    console.error('Error fetching hackathons:', error);
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
        if (values.image && values.image.fileList.length > 0) {
            formData.append('image', values.image.fileList[0].originFileObj);
        }

        try {
            if (isEditing) {
                await axios.put(`https://project-k-s2nr.onrender.com/focusarea/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Focus area updated successfully');
            } else {
                await axios.post('https://project-k-s2nr.onrender.com/focusarea', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Focus area added successfully');
            }
            setIsModalVisible(false);
            fetchFocusAreas();
        } catch (error) {
            console.error('Error saving focus area:', error);
            message.error('Error saving focus area');
        }
    };

    const startEditing = (focusArea) => {
        setIsEditing(true);
        setEditingId(focusArea._id);
        setIsModalVisible(true);
        form.setFieldsValue({
            title: focusArea.title,
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://project-k-s2nr.onrender.com/focusarea/${id}`);
            setFocusAreas(focusAreas.filter(area => area._id !== id));
            message.success('Focus area deleted successfully');
        } catch (error) {
            console.error('Error deleting focus area:', error);
            message.error('Error deleting focus area');
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Are you sure you want to delete this focus area?',
            onOk() {
                handleDelete(id);
            },
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
                <Col>
                    <Title level={2}>Focus Areas</Title>
                </Col>
            </Row>
            <Row justify="center" style={{ marginBottom: '20px' }}>
                <Col>
                    <Button type="primary" onClick={showModal}>
                        Add Focus Area
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                {focusAreas.map((focusArea) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={focusArea._id}>
                        <Card
                            cover={focusArea.image && (
                                <img
                                    alt={focusArea.title}
                                    src={`data:${focusArea.image.contentType};base64,${arrayBufferToBase64(focusArea.image.data)}`}
                                    style={{ height: 200, objectFit: 'cover' }}
                                />
                            )}
                            actions={[
                                <Button icon={<EditOutlined />} onClick={() => startEditing(focusArea)} />,
                                <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(focusArea._id)} />,
                            ]}
                        >
                            <Meta
                                title={focusArea.title}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title={isEditing ? "Edit Focus Area" : "Add Focus Area"}
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

export default FocusAreasManager;