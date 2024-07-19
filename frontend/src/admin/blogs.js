import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Typography, Row, Col, Card, Modal, Form, Input, DatePicker, Upload, Image, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Paragraph, Text, Link } = Typography;

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const viewPDF = (record, download = false) => {
  const base64Data = arrayBufferToBase64(record.files[0].data);
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

  if (download) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = `${record.title}.pdf`;
    link.click();
  } else {
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogType, setBlogType] = useState('');
  // const [modalVisible, setModalVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const blogTypes = ['NewsLetter', 'FMML', 'Workshops', 'Webinars', 'Contests'];

  const fetchBlogs = useCallback(async () => {
    if (!blogType) return;
    try {
      const response = await axios.get(`https://project-k-s2nr.onrender.com/blogs/${blogType}`);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  }, [blogType]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://project-k-s2nr.onrender.com/blogs/${blogType}/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
    editForm.setFieldsValue({
      title: blog.title,
      shortDescription: blog.shortDescription,
      longDescription: blog.longDescription,
      youtubeLink: blog.youtubeLink,
      date: moment(blog.date),
    });
  };

  const handleEditSubmit = async (values) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        if (key === 'files' && values[key]) {
          values[key].fileList.forEach((file) => {
            formData.append('files', file.originFileObj);
          });
        } else {
          formData.append(key, values[key]);
        }
      }

      await axios.put(`https://project-k-s2nr.onrender.com/blogs/${blogType}/${selectedBlog._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchBlogs();
      setIsEditing(false);
      setSelectedBlog(null);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleCreate = async (values) => {
    try {
      const formData = new FormData();
      for (const key in values) {
        if (key === 'files') {
          values[key].fileList.forEach((file) => {
            formData.append('files', file.originFileObj);
          });
        } else if (key === 'date') {
          formData.append(key, values[key].format('DD-MM-YYYY'));
        } else {
          formData.append(key, values[key]);
        }
      }

      await axios.post(`https://project-k-s2nr.onrender.com/blogs/${blogType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Blog post created successfully!');
      setIsCreating(false);
      createForm.resetFields();
      fetchBlogs();
    } catch (error) {
      console.error('Error creating blog:', error);
      message.error('Failed to create blog post. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <Text>{moment(text).format('DD-MM-YYYY')}</Text>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <Title level={4}>{text}</Title>,
    },
    {
      title: 'Short Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      render: (text) => <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => setSelectedBlog(record)}>View Details</Button>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </>
      ),
    },
  ];

  const renderNewsLetterTable = () => (
    <Table
      dataSource={blogs}
      columns={columns}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
    />
  );

  const renderEventCard = (blog) => (
    <Col xs={24} sm={12} md={8} lg={6} xl={6} key={blog._id}>
      <Card
        hoverable
        cover={
          blog.files && blog.files.length > 0 ? (
            <Image 
              alt={blog.title} 
              src={`data:image/jpeg;base64,${arrayBufferToBase64(blog.files[0].data)}`}
              style={{ height: 200, objectFit: 'cover' }}
            />
          ) : null
        }
        style={{ marginBottom: 16 }}
        actions={[
          <Button type="link" onClick={() => setSelectedBlog(blog)}>View Details</Button>,
          <Button type="link" onClick={() => handleEdit(blog)}>Edit</Button>,
          <Button type="link" danger onClick={() => handleDelete(blog._id)}>Delete</Button>,
        ]}
      >
        <Title level={4}>{blog.title}</Title>
        <Text type="secondary">{moment(blog.date).format('DD-MM-YYYY')}</Text>
        <Paragraph ellipsis={{ rows: 2 }}>{blog.shortDescription}</Paragraph>
      </Card>
    </Col>
  );

  const renderBlogDetails = () => {
    if (!selectedBlog) return null;

    return (
      <>
        <Title level={3}>{selectedBlog.title}</Title>
        <Text type="secondary">Date: {moment(selectedBlog.date).format('DD-MM-YYYY')}</Text>
        <Paragraph><strong>Short Description:</strong> {selectedBlog.shortDescription}</Paragraph>
        <Paragraph><strong>Long Description:</strong> {selectedBlog.longDescription}</Paragraph>
        {selectedBlog.youtubeLink && (
          <Paragraph>
            <strong>YouTube Link:</strong> <Link href={selectedBlog.youtubeLink} target="_blank" rel="noopener noreferrer">Watch Video</Link>
          </Paragraph>
        )}
        {blogType === 'NewsLetter' && selectedBlog.files && selectedBlog.files.length > 0 && (
          <div>
            <Title level={4}>Attached Files:</Title>
            {selectedBlog.files.map((file, index) => (
              <div key={index} style={{ marginBottom: 8 }}>
                <Button onClick={() => viewPDF({ files: [file] })} style={{ marginRight: 8 }}>
                  View File {index + 1}
                </Button>
                <Button onClick={() => viewPDF({ files: [file] }, true)} style={{ marginRight: 8 }}>
                  Download File {index + 1}
                </Button>
              </div>
            ))}
          </div>
        )}
        {blogType !== 'NewsLetter' && selectedBlog.files && selectedBlog.files.length > 0 && (
          <div>
            <Title level={4}>Image:</Title>
            <Image
              src={`data:image/jpeg;base64,${arrayBufferToBase64(selectedBlog.files[0].data)}`}
              alt={selectedBlog.title}
              style={{ maxWidth: '100%', maxHeight: 300 }}
            />
          </div>
        )}
      </>
    );
  };

  const renderCreateForm = () => (
    <Form form={createForm} onFinish={handleCreate} layout="vertical">
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="shortDescription" label="Short Description" rules={[{ required: true, message: 'Please input the short description!' }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="longDescription" label="Long Description" rules={[{ required: true, message: 'Please input the long description!' }]}>
        <Input.TextArea />
      </Form.Item>
      {blogType === 'Webinars' && (
        <Form.Item name="youtubeLink" label="YouTube Link" rules={[{ required: true, message: 'Please input the YouTube link!' }]}>
          <Input />
        </Form.Item>
      )}
      <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select the date!' }]}>
        <DatePicker format="DD-MM-YYYY" />
      </Form.Item>
      {blogType === 'NewsLetter' ? (
        <Form.Item name="files" label="Upload Files">
          <Upload multiple>
            <Button icon={<UploadOutlined />}>Select Files</Button>
          </Upload>
        </Form.Item>
      ) : (
        <Form.Item name="files" label="Upload Image">
          <Upload>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Blog Post
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {blogTypes.map(type => (
          <Button
            key={type}
            onClick={() => setBlogType(type)}
            type={blogType === type ? 'primary' : 'default'}
            style={{ marginRight: '10px' }}
          >
            {type}
          </Button>
        ))}
      </div>
      {blogType && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button onClick={() => setIsCreating(true)} type="primary">
            Create New {blogType}
          </Button>
        </div>
      )}
      {blogType === 'NewsLetter' ? renderNewsLetterTable() : (
        <Row gutter={[16, 16]}>
          {blogs.map(renderEventCard)}
        </Row>
      )}
      <Modal
        visible={!!selectedBlog}
        onCancel={() => setSelectedBlog(null)}
        footer={null}
        width={800}
      >
        {renderBlogDetails()}
      </Modal>
      <Modal
        visible={isEditing}
        onCancel={() => {
          setIsEditing(false);
          setSelectedBlog(null);
        }}
        onOk={() => {
          editForm.validateFields().then((values) => {
            handleEditSubmit(values);
          });
        }}
        title="Edit Blog"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="shortDescription" label="Short Description" rules={[{ required: true, message: 'Please input the short description!' }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="longDescription" label="Long Description" rules={[{ required: true, message: 'Please input the long description!' }]}>
            <Input.TextArea />
          </Form.Item>
          {blogType === 'Webinars' && (
            <Form.Item name="youtubeLink" label="YouTube Link" rules={[{ required: true, message: 'Please input the YouTube link!' }]}>
              <Input />
            </Form.Item>
          )}
          <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select the date!' }]}>
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>
          {blogType === 'NewsLetter' ? (
            <Form.Item name="files" label="Upload Files">
              <Upload multiple>
                <Button icon={<UploadOutlined />}>Select Files</Button>
              </Upload>
            </Form.Item>
          ) : (
            <Form.Item name="files" label="Upload Image">
              <Upload>
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Modal
        visible={isCreating}
        onCancel={() => setIsCreating(false)}
        footer={null}
        title={`Create New ${blogType}`}
      >
        {renderCreateForm()}
      </Modal>
    </div>
  );
}

export default Blogs;
