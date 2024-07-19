// src/components/Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Drawer } from 'antd';
import { LogoutOutlined, MenuOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/admin/login');
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const menuItems = [
    { key: '/admin/main', label: 'Dashboard' },
    { key: '/admin/TeamForm', label: 'Team Form' },
    { key: '/admin/alumni', label: 'Alumni' },
    { key: '/admin/achievements', label: 'Achievements' },
    { key: '/admin/focus-areas', label: 'Focus Areas' },
    { key: '/admin/projects', label: 'Projects' },
    { key: '/admin/hackathons', label: 'Hackathons' },
    { key: '/admin/blogs', label: 'Blogs' },
    { key: '/admin/events', label: 'Events' },
  ];

  return (
    <>
      <AntHeader className="header" style={{ backgroundColor: '#1890ff', display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ color: '#fff', fontSize: '1.5em', fontWeight: 'bold', flex: 1 }}>
          Admin Dashboard
        </div>
        <Button
          className="menuButton"
          type="primary"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          style={{ display: 'none' }}
        />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['/admin/main']}
          style={{ flex: 4, justifyContent: 'center' }}
          className="menu"
        >
          {menuItems.map(item => (
            <Menu.Item key={item.key} onClick={() => navigate(item.key)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ marginLeft: 'auto' }}
        >
          Logout
        </Button>
      </AntHeader>
      <Drawer
        title="Admin Menu"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Menu
          theme="light"
          mode="vertical"
          defaultSelectedKeys={['/admin/main']}
        >
          {menuItems.map(item => (
            <Menu.Item key={item.key} onClick={() => {
              navigate(item.key);
              onClose();
            }}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>
    </>
  );
};

export default Header;
