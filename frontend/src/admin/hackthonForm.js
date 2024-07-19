import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Upload, Typography, message, Modal, Row, Col, Card, Form } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;
const { Meta } = Card;

const HackathonPage = () => {
    const [hackathons, setHackathons] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
          const response = await axios.get('http://localhost:5000/hackathon');
          const sortedHackathons = response.data.sort((a, b) => b._id.localeCompare(a._id));
          setHackathons(sortedHackathons);
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
        formData.append('oneLineDescription', values.oneLineDescription);
        formData.append('largeDescription', values.largeDescription);
        
        // Handle image files
        if (values.images) {
            values.images.forEach((file) => {
                formData.append('images', file.originFileObj);
            });
        }
    
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/hackathon/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Hackathon updated successfully');
            } else {
                await axios.post('http://localhost:5000/hackathon', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Hackathon added successfully');
            }
            setIsModalVisible(false);
            fetchHackathons();
        } catch (error) {
            console.error('Error saving hackathon:', error);
            message.error('Error saving hackathon');
        }
    };

    const startEditing = (hackathon) => {
        setIsEditing(true);
        setEditingId(hackathon._id);
        setIsModalVisible(true);
        form.setFieldsValue({
            title: hackathon.title,
            oneLineDescription: hackathon.oneLineDescription,
            largeDescription: hackathon.largeDescription,
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/hackathon/${id}`);
            setHackathons(hackathons.filter(hackathon => hackathon._id !== id));
            message.success('Hackathon deleted successfully');
        } catch (error) {
            console.error('Error deleting hackathon:', error);
            message.error('Error deleting hackathon');
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Are you sure you want to delete this hackathon?',
            onOk() {
                handleDelete(id);
            },
        });
    };

    const renderImages = (images) => {
        return images.map((image, index) => {
            const base64String = btoa(
                new Uint8Array(image.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return (
                <img
                    key={index}
                    src={`data:${image.contentType};base64,${base64String}`}
                    alt={`Hackathon ${index}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                />
            );
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
                <Col>
                    <Title level={2}>Hackathons</Title>
                </Col>
            </Row>
            <Row justify="center" style={{ marginBottom: '20px' }}>
                <Col>
                    <Button type="primary" onClick={showModal}>
                        Add Hackathon
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                {hackathons.map((hackathon) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={hackathon._id}>
                        <Card
                            cover={hackathon.images && hackathon.images.length > 0 && (
                                <img
                                    alt={hackathon.title}
                                    src={`data:${hackathon.images[0].contentType};base64,${btoa(
                                        new Uint8Array(hackathon.images[0].data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                                    )}`}
                                    style={{ height: 200, objectFit: 'cover' }}
                                />
                            )}
                            actions={[
                                <Button icon={<EditOutlined />} onClick={() => startEditing(hackathon)} />,
                                <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(hackathon._id)} />,
                            ]}
                        >
                            <Meta
                                title={hackathon.title}
                                description={hackathon.oneLineDescription}
                            />
                            <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                {hackathon.largeDescription}
                            </Paragraph>
                            <div>{renderImages(hackathon.images)}</div>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title={isEditing ? "Edit Hackathon" : "Add Hackathon"}
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

export default HackathonPage;