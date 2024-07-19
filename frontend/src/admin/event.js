import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Input, Upload, Typography, message, Modal, Row, Col, Card, Form, Select, DatePicker, Carousel } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;
const { Meta } = Card;

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust this to match your backend URL
});

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

function EventPhotoGalleryPage() {
  const [type, setType] = useState('event');
  const [items, setItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchItems = useCallback(async () => {
    try {
      const response = await api.get(`/${type}`);
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching items:', err);
      message.error('Failed to fetch items. Please try again.');
    }
  }, [type]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSubmit = async (values) => {
    let endpoint = type === 'event' ? '/event' : '/photo-gallery';
    let method = 'post';

    if (editingId) {
      endpoint += `/${editingId}`;
      method = 'put';
    }

    const formData = new FormData();

    for (const key in values) {
      if (key === 'images' && type === 'photo-gallery' && values.images) {
        values.images.forEach((file) => {
          if (file.originFileObj) {
            formData.append('images', file.originFileObj);
          }
        });
      } else if (key === 'image' && type === 'event' && values.image && values.image.length > 0) {
        if (values.image[0].originFileObj) {
          formData.append('image', values.image[0].originFileObj);
        }
      } else if (key === 'eventDate' && values[key]) {
        formData.append(key, values[key].format('YYYY-MM-DD'));
      } else if (values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    }

    try {
      const response = await api[method](endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.status >= 200 && response.status < 300) {
        message.success(`Item ${editingId ? 'updated' : 'created'} successfully`);
        setIsModalVisible(false);
        form.resetFields();
        setEditingId(null);
        fetchItems();
      } else {
        throw new Error(`Server responded with status code ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error(`Failed to ${editingId ? 'update' : 'create'} item. ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${type}/${id}`);
      message.success('Item deleted successfully');
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      message.error('Failed to delete item. Please try again.');
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Are you sure you want to delete this item?',
      onOk() {
        handleDelete(id);
      },
    });
  };

  const showModal = (item = null) => {
    if (item) {
      setEditingId(item._id);
      form.setFieldsValue({
        ...item,
        eventDate: item.eventDate ? moment(item.eventDate) : null,
        image: item.image ? [{ uid: '-1', name: 'image.png', status: 'done', url: `data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data)}` }] : [],
        images: item.images ? item.images.map((img, index) => ({ uid: `-${index}`, name: `image${index}.png`, status: 'done', url: `data:${img.contentType};base64,${arrayBufferToBase64(img.data)}` })) : [],
      });
    } else {
      form.resetFields();
      setEditingId(null);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const currentDate = new Date();
  const upcomingEventsItems = items.filter(item => new Date(item.eventDate) >= currentDate);
  const whatsNewItems = items.filter(item => new Date(item.eventDate) < currentDate);

  const renderEventList = (eventItems, title) => (
    <>
      <Title level={3}>{title}</Title>
      <Row gutter={[16, 16]}>
        {eventItems.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
            <Card
              cover={item.image && (
                <img
                  alt={item.title}
                  src={`data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data)}`}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              )}
              actions={[
                <Button icon={<EditOutlined />} onClick={() => showModal(item)} />,
                <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(item._id)} />,
              ]}
            >
              <Meta
                title={item.title}
                description={
                  <>
                    <p>{item.smallDescription}</p>
                    <p>{moment(item.eventDate).format('MMMM D, YYYY')}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

  return (
    <div style={{ padding: '20px' }}>
      <Row justify="center" align="middle" style={{ marginBottom: '20px' }}>
        <Col>
          <Title level={2}>{type === 'event' ? 'Events' : 'Photo Galleries'}</Title>
        </Col>
      </Row>

      <Row justify="center" style={{ marginBottom: '20px' }}>
        <Col>
          <Select value={type} onChange={setType} style={{ marginRight: '10px' }}>
            <Select.Option value="event">Event</Select.Option>
            <Select.Option value="photo-gallery">Photo Gallery</Select.Option>
          </Select>
          <Button type="primary" onClick={() => showModal()}>
            Add {type === 'event' ? 'Event' : 'Photo Gallery'}
          </Button>
        </Col>
      </Row>

      {type === 'event' && (
        <>
          {renderEventList(upcomingEventsItems, "Upcoming Events")}
          {renderEventList(whatsNewItems, "What's New")}
        </>
      )}

      {type === 'photo-gallery' && (
        <>
          <Title level={3}>Photo Gallery</Title>
          <Row gutter={[16, 16]}>
            {items.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                <Card
                  cover={
                    <Carousel>
                      {item.images && item.images.map((image, index) => (
                        <div key={index}>
                          <img
                            alt={`${item.title} - ${index + 1}`}
                            src={`data:${image.contentType};base64,${arrayBufferToBase64(image.data)}`}
                            style={{ height: 200, width: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </Carousel>
                  }
                  actions={[
                    <Button icon={<EditOutlined />} onClick={() => showModal(item)} />,
                    <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(item._id)} />,
                  ]}
                >
                  <Meta title={item.title} />
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <Modal
        title={editingId ? `Edit ${type}` : `Add ${type}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>

          {type === 'event' && (
            <>
              <Form.Item name="smallDescription" label="Small Description">
                <Input />
              </Form.Item>
              <Form.Item name="longDescription" label="Long Description">
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item name="eventDate" label="Event Date" rules={[{ required: true, message: 'Please select the event date!' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item 
                name="image" 
                label="Image" 
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
                  maxCount={1}
                  listType="picture-card"
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </>
          )}

          {type === 'photo-gallery' && (
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
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EventPhotoGalleryPage;