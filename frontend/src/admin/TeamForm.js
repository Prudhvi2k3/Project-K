import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Input, Select, Upload, message, Modal, Space, Popconfirm, Row, Col, Dropdown, Menu } from 'antd';
import { EditOutlined, DeleteOutlined, UploadOutlined, PlusOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';

const { Option } = Select;

const TeamList = () => {
    const currentYearBatch = `Batch-${new Date().getFullYear()}`;

    const [teams, setTeams] = useState([]);
    const [editingTeam, setEditingTeam] = useState(null);
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const [batches, setBatches] = useState(() => {
        const savedBatches = localStorage.getItem('batches');
        const initialBatches = savedBatches ? JSON.parse(savedBatches) : ['Batch-2023', 'Batch-2024'];
        if (!initialBatches.includes(currentYearBatch)) {
            initialBatches.push(currentYearBatch);
        }
        return initialBatches;
    });

    const [roles, setRoles] = useState(() => {
        const savedRoles = localStorage.getItem('roles');
        return savedRoles ? JSON.parse(savedRoles) : ['Team-Lead', 'Team-Mentor', 'Senior-Developer', 'Junior-Developer'];
    });

    const [teamNumbers, setTeamNumbers] = useState(() => {
        const savedTeams = localStorage.getItem('teams');
        return savedTeams ? JSON.parse(savedTeams) : [1, 2, 3, 4, 5, 6, 7, 8];
    });

    const [newBatch, setNewBatch] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newTeamNumber, setNewTeamNumber] = useState('');
    const [activeBatch, setActiveBatch] = useState(currentYearBatch);

    useEffect(() => {
        localStorage.setItem('batches', JSON.stringify(batches));
    }, [batches]);

    useEffect(() => {
        localStorage.setItem('teams', JSON.stringify(teamNumbers));
    }, [teamNumbers]);

    useEffect(() => {
        localStorage.setItem('roles', JSON.stringify(roles));
    }, [roles]);

    const fetchTeams = useCallback(async () => {
        if (!activeBatch) return;
        try {
            const response = await axios.get(`https://project-k-s2nr.onrender.com/teams/${activeBatch}`);
            setTeams(response.data);
        } catch (error) {
            console.error('Error fetching team data:', error);
            message.error('Error fetching team data');
        }
    }, [activeBatch]);

    useEffect(() => {
        if (activeBatch) {
            fetchTeams();
        }
    }, [fetchTeams, activeBatch]);

    const handleEdit = (record) => {
        setEditingTeam(record);
        form.setFieldsValue({
            ...record,
            photo: record.photo ? [{
                uid: '-1',
                name: 'Current Photo',
                status: 'done',
                url: `data:${record.photo.contentType};base64,${arrayBufferToBase64(record.photo.data)}`
            }] : []
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://project-k-s2nr.onrender.com/teams/${activeBatch}/${id}`);
            fetchTeams();
            message.success('Team member deleted successfully');
        } catch (error) {
            console.error('Error deleting team data:', error);
            message.error('Error deleting team data');
        }
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        for (const key in values) {
            if (key === 'photo' && values[key]) {
                values[key].forEach((file) => {
                    if (file.originFileObj) {
                        formData.append('photo', file.originFileObj);
                    }
                });
            } else {
                formData.append(key, values[key]);
            }
        }

        try {
            if (editingTeam) {
                await axios.put(`https://project-k-s2nr.onrender.com/teams/${activeBatch}/${editingTeam._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Team member updated successfully');
            } else {
                await axios.post(`https://project-k-s2nr.onrender.com/teams/${values.batchName}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                message.success('Team member added successfully');
            }
            setEditingTeam(null);
            form.resetFields();
            fetchTeams();
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error submitting team data:', error);
            message.error('Error submitting team data');
        }
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const handleAddBatch = () => {
        if (newBatch && !batches.includes(newBatch)) {
            setBatches([...batches, newBatch]);
            setNewBatch('');
            message.success('New batch added successfully');
        } else {
            message.error('Batch already exists or invalid batch name');
        }
    };

    const handleAddRole = () => {
        if (newRole && !roles.includes(newRole)) {
            setRoles([...roles, newRole]);
            setNewRole('');
            message.success('New role added successfully');
        } else {
            message.error('Role already exists or invalid role name');
        }
    };

    const handleAddTeamNumber = () => {
        const num = parseInt(newTeamNumber);
        if (num && !teamNumbers.includes(num)) {
            setTeamNumbers([...teamNumbers, num]);
            setNewTeamNumber('');
            message.success('New team number added successfully');
        } else {
            message.error('Team number already exists or invalid number');
        }
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    });

    const columns = [
        {
            title: 'Team Number',
            dataIndex: 'teamNumber',
            key: 'teamNumber',
            sorter: (a, b) => a.teamNumber - b.teamNumber,
            ...getColumnSearchProps('teamNumber'),
            width: 200,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
            width: 350,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            sorter: (a, b) => a.role.localeCompare(b.role),
            ...getColumnSearchProps('role'),
            width: 200,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            ...getColumnSearchProps('email'),
            width: 250,
        },
        {
            title: 'GitHub',
            dataIndex: 'github',
            key: 'github',
            render: (text) => <a href={text}>GitHub</a>,
            width: 80,
        },
        {
            title: 'LinkedIn',
            dataIndex: 'linkedin',
            key: 'linkedin',
            render: (text) => <a href={text}>LinkedIn</a>,
            width: 80,
        },
        {
            title: 'Photo',
            dataIndex: 'photo',
            key: 'photo',
            render: (photo) => (
                photo && photo.data ? 
                <img
                    src={`data:${photo.contentType};base64,${arrayBufferToBase64(photo.data)}`}
                    alt="Profile"
                    style={{ width: '120px', height: '120px', }}
                /> : 'No Photo'
            ),
            width: 150,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Are you sure to delete this team member?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
            width: 150,
        },
    ];

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => setIsAddModalVisible(true)}>Add Batch, Role, Team Number</Menu.Item>
        </Menu>
    );

    return (
        <div>
            <Row justify="space-between" align="middle">
                <Col>
                    <Form.Item label="Select Batch">
                        <Select
                            placeholder="Select Batch"
                            value={activeBatch}
                            onChange={setActiveBatch}
                            style={{ width: 200 }}
                        >
                            {batches.map((batch, index) => (
                                <Option key={index} value={batch}>
                                    {batch}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                        Add Team Member
                    </Button>
                </Col>
                <Col>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button>
                            Actions <DownOutlined />
                        </Button>
                    </Dropdown>
                </Col>
            </Row>
            <Table columns={columns} dataSource={teams} rowKey="_id" />
            <Modal
                title={editingTeam ? 'Edit Team Member' : 'Add Team Member'}
                visible={isModalVisible}
                onCancel={() => {
                    setEditingTeam(null);
                    form.resetFields();
                    setIsModalVisible(false);
                }}
                onOk={() => form.submit()}
                okText="Submit"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Batch Name"
                        name="batchName"
                        initialValue={currentYearBatch}
                        rules={[{ required: true, message: 'Please select a batch' }]}
                    >
                        <Select placeholder="Select Batch">
                            {batches.map((batch, index) => (
                                <Option key={index} value={batch}>
                                    {batch}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Team Number"
                        name="teamNumber"
                        rules={[{ required: true, message: 'Please enter a team number' }]}
                    >
                        <Select placeholder="Select Team Number">
                            {teamNumbers.map((num) => (
                                <Option key={num} value={num}>
                                    {num}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter the name' }]}
                    >
                        <Input placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter the email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please enter the role' }]}
                    >
                        <Select placeholder="Select Role">
                            {roles.map((role, index) => (
                                <Option key={index} value={role}>
                                    {role}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="GitHub"
                        name="github"
                        rules={[{ required: true, message: 'Please enter GitHub profile link' }]}
                    >
                        <Input placeholder="Enter GitHub link" />
                    </Form.Item>
                    <Form.Item
                        label="LinkedIn"
                        name="linkedin"
                        rules={[{ required: true, message: 'Please enter LinkedIn profile link' }]}
                    >
                        <Input placeholder="Enter LinkedIn link" />
                    </Form.Item>
                    <Form.Item label="Photo" name="photo" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            accept=".png,.jpeg,.jpg"
                        >
                            <Button icon={<UploadOutlined />}>Upload Photo</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Add Batch, Role, Team Number"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onOk={() => {
                    handleAddBatch();
                    handleAddRole();
                    handleAddTeamNumber();
                    setIsAddModalVisible(false);
                }}
                okText="Submit"
            >
                <Form layout="vertical">
                    <Form.Item label="Add New Batch">
                        <Input
                            value={newBatch}
                            onChange={(e) => setNewBatch(e.target.value)}
                            placeholder="New Batch Name"
                        />
                    </Form.Item>
                    <Form.Item label="Add New Role">
                        <Input
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            placeholder="New Role Name"
                        />
                    </Form.Item>
                    <Form.Item label="Add New Team Number">
                        <Input
                            value={newTeamNumber}
                            onChange={(e) => setNewTeamNumber(e.target.value)}
                            placeholder="New Team Number"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TeamList;