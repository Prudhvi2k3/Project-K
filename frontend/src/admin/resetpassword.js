import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import './resetpassword.css'; // Custom styles

const { Title } = Typography;

function ResetPassword() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { id, token } = useParams();

    axios.defaults.withCredentials = true;

    const handleSubmit = async (values) => {
      try {
        const response = await axios.post(`http://localhost:5000/reset-password/${id}/${token}`, { password: values.password });
        message.success(response.data.message); // Show success message
        navigate('/admin/login');
      } catch (error) {
        console.error('Error in handleSubmit:', error); // Log the error for debugging
        message.error(error.response.data.message || 'Failed to reset password'); // Show error message
      }
    };
    
    return (
        <div className="reset-container">
            <div className="New-password">
                <Title level={2} className="font-Synet">Reset Password</Title>
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your new password!' }]}
                    >
                        <Input.Password
                            placeholder="Enter New Password"
                            autoComplete="off"
                            style={{ borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.8)', color: 'black' }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%', borderRadius: '8px' }}
                        >
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default ResetPassword;
