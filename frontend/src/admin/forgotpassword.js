import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import './forgotpassword.css'; // Custom styles if needed

const { Title } = Typography;

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/forgotpassword', { email: values.email });
            message.success(response.data.message); // Show success message
            navigate('/admin/login');
        } catch (error) {
            message.error('An error occurred. Please try again.',error);
            console.error(error);
            message.error(error.response.data.message || 'Failed to send link');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form">
                <Title level={2} style={{ textAlign: 'center', color: 'white' }}>Forgot Password</Title>
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="form"
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email!' }]}
                    >
                        <Input
                            placeholder="Enter your email"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', borderRadius: '8px' }}
                        >
                            Send
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default ForgotPassword;
