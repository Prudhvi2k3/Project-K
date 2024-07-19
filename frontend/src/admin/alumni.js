import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Col, Form, Input, Row, Select, Upload, Modal } from 'antd';
import { UploadOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Option } = Select;

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

const AlumniManager = () => {
    const [alumni, setAlumni] = useState([]);
    const [filteredAlumni, setFilteredAlumni] = useState([]);
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [batch, setBatch] = useState('');

    useEffect(() => {
        fetchAlumni();
    }, []);

    useEffect(() => {
        filterAlumniByBatch();
    }, [batch, alumni]);

    const fetchAlumni = async () => {
        try {
            const response = await axios.get('https://project-k-s2nr.onrender.com/alumni');
            setAlumni(response.data);
        } catch (error) {
            console.error('Error fetching alumni:', error);
        }
    };

    const filterAlumniByBatch = () => {
        if (batch) {
            setFilteredAlumni(alumni.filter(alum => alum.batchName === batch));
        } else {
            setFilteredAlumni(alumni);
        }
    };

    const handleFinish = async (values) => {
        const formData = new FormData();
        for (const key in values) {
            formData.append(key, values[key]);
        }
        if (values.photo) {
            formData.append('photo', values.photo.file.originFileObj);
        }

        try {
            if (editMode) {
                await axios.put(`https://project-k-s2nr.onrender.com/alumni/${editId}`, formData);
            } else {
                await axios.post('https://project-k-s2nr.onrender.com/alumni', formData);
            }
            setEditMode(false);
            setEditId('');
            form.resetFields();
            fetchAlumni();
            setModalVisible(false);
        } catch (error) {
            console.error('Error adding/updating alumni:', error);
        }
    };

    const handleEdit = (alum) => {
        setEditMode(true);
        setEditId(alum._id);
        form.setFieldsValue({
            name: alum.name,
            role: alum.role,
            github: alum.github,
            linkedin: alum.linkedin,
            email: alum.email,
            batchName: alum.batchName
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://project-k-s2nr.onrender.com/alumni/${id}`);
            fetchAlumni();
        } catch (error) {
            console.error('Error deleting alumni:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Alumni Manager</h1>
            <div style={{ marginBottom: 20 }}>
                <Select
                    placeholder="Select Batch"
                    style={{ width: 200, marginRight: 10 }}
                    onChange={value => setBatch(value)}
                    allowClear
                >
                    {Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => 2022 + i).map(year => (
                        <Option key={year} value={`Batch-${year}`}>{`Batch-${year}`}</Option>
                    ))}
                </Select>
                <Button type="primary" onClick={() => setModalVisible(true)}>Add Alumni</Button>
            </div>
            <Modal
                title={editMode ? 'Update Alumni' : 'Add Alumni'}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleFinish} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please enter the role' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="github" label="GitHub">
                        <Input prefix={<GithubOutlined />} />
                    </Form.Item>
                    <Form.Item name="linkedin" label="LinkedIn">
                        <Input prefix={<LinkedinOutlined />} />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input prefix={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item name="batchName" label="Batch Name" rules={[{ required: true, message: 'Please select a batch name' }]}>
                        <Select>
                            {Array.from({ length: new Date().getFullYear() - 2022 + 1 }, (_, i) => 2022 + i).map(year => (
                                <Option key={year} value={`Batch-${year}`}>{`Batch-${year}`}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="photo" label="Photo">
                        <Upload name="photo" listType="picture" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Upload Photo</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editMode ? 'Update Alumni' : 'Add Alumni'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Row gutter={[16, 16]} justify="center">
                {filteredAlumni.map((alum) => (
                    <Col key={alum._id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            cover={
                                <img
                                    alt={alum.name}
                                    src={`data:image/jpeg;base64,${arrayBufferToBase64(alum.photo.data)}`}
                                />
                            }
                            actions={[
                                <GithubOutlined key="github" onClick={() => window.open(alum.github)} />,
                                <LinkedinOutlined key="linkedin" onClick={() => window.open(alum.linkedin)} />,
                                <MailOutlined key="mail" onClick={() => window.open(`mailto:${alum.email}`)} />,
                                <Button type="link" onClick={() => handleEdit(alum)}>Edit</Button>,
                                <Button type="link" danger onClick={() => handleDelete(alum._id)}>Delete</Button>
                            ]}
                        >
                            <Card.Meta title={alum.name} description={`${alum.role} - ${alum.batchName}`} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default AlumniManager;
