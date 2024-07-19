// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';
import { motion } from 'framer-motion';
import loginImage from '../img/logo.png';
import './signin.css';

const { Title, Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });

      if (response.data.userId) {
        setUserId(response.data.userId);
        setIsOtpSent(true);
      } else {
        message.error('Login failed. Please try again.');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { userId, otp });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        navigate('/admin/main');
      } else {
        message.error('OTP verification failed. Please try again.');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/resend-otp', { userId });
      if (response.data.message) {
        message.success(response.data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      message.error(error.response.data.message || 'An error occurred. Please try again.');
    } else if (error.request) {
      message.error('No response from server. Please try again later.');
    } else {
      message.error('An error occurred. Please try again.');
    }
    console.error('Login error', error);
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
          <img src={loginImage} alt="Login" className="h-full w-full object-cover rounded-lg" />
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
                {isOtpSent ? 'Enter OTP' : 'Welcome Admin Please Sign in'}
              </Title>
            </div>
            <Form
              className="mt-8 space-y-6"
              onFinish={isOtpSent ? handleVerifyOtp : handleLogin}
            >
              {!isOtpSent ? (
                <>
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!' }]}
                  >
                    <Input
                      placeholder="Email address"
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
                    <Link to="/admin/forgot-password">
                      <Text type="secondary" className="text-white">Forgot your password?</Text>
                    </Link>
                  </Form.Item>
                </>
              ) : (
                <Form.Item
                  name="otp"
                  rules={[{ required: true, message: 'Please enter the OTP!' }]}
                >
                  <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-white"
                  />
                </Form.Item>
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  className="w-full"
                >
                  {isOtpSent ? 'Verify OTP' : 'Sign in'}
                </Button>
              </Form.Item>

              {isOtpSent && (
                <Form.Item>
                  <Button
                    type="link"
                    onClick={handleResendOtp}
                    loading={isLoading}
                    className="w-full"
                  >
                    Resend OTP
                  </Button>
                </Form.Item>
              )}
            </Form>

            {!isOtpSent && (
              <div className="text-center">
                <Text type="secondary" className="text-white">
                  Not An Admin? Contact{' '}
                  <Link to="/contact" className="text-indigo-500">
                    Our Team
                  </Link>
                </Text>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
