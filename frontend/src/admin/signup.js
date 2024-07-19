// src/components/Signup.js
import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';
import signupImage from '../img/logo.png'; // Replace with your actual image path

const { Title } = Typography;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/signup', { email, password });
      setMessage(response.data.message);
      message.success(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error || 'An error occurred');
      message.error(error.response.data.error || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-black p-8 rounded-lg shadow-lg flex flex-col md:flex-row">
        <motion.div
          className="w-full md:w-1/2 p-4"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: { opacity: 0, y: -50 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
          }}
        >
          <img src={signupImage} alt="Signup" className="h-full w-full object-cover rounded-lg" />
        </motion.div>
        <motion.div
          className="w-full md:w-1/2 p-4"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={{
            initial: { opacity: 0, y: -50 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            exit: { opacity: 0, y: -50, transition: { duration: 0.5 } },
          }}
        >
          <div className="max-w-md w-full space-y-8">
            <div>
              <Title level={2} className="text-center text-white">
                Register as Admin
              </Title>
            </div>
            <Form
              className="mt-8 space-y-6"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please enter your email!' }]}
              >
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-white"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-white"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  className="w-full"
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
            {message && <p className="text-center text-white">{message}</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
