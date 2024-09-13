import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Input, Typography, Space, Button, Form, message, Avatar, InputNumber } from "antd";
import { GetWorkById, UpdateWorkById, CreateWork, GetUserProfile } from "../../services/https/index";

const { Text } = Typography;

export default function PostEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [profileImage, setProfileImage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const profileRes = await GetUserProfile();
      setProfileImage(profileRes.Profile || '');
      setFirstName(profileRes.FirstName || "No first name");
      setLastName(profileRes.LastName || "No last name");
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Failed to fetch user profile",
      });
    }
  };

  // Function to fetch work data by ID
  const getWorkById = async (id: string) => {
    try {
      let res = await GetWorkById(id);
      if (res.status === 200) {
        form.setFieldsValue({
          Info: res.data.Info,
          Wages: res.data.Wages,
          Category: res.data.Category,
          Contact: res.data.Contact,
        });
      } else {
        messageApi.open({
          type: "error",
          content: "ไม่พบข้อมูลงาน",
        });
        setTimeout(() => {
          navigate("/work");
        }, 2000);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error fetching work data",
      });
    }
  };

  // Effect hook to fetch profile and work data
  useEffect(() => {
    fetchUserProfile();
    if (id) {
      getWorkById(id);
    }
  }, [id]);

  // Function to generate random WorkID
  const generateRandomWorkID = () => {
    const letters = Math.random().toString(36).substring(2, 4).toUpperCase();
    const digits = Math.floor(100 + Math.random() * 900);
    return `${letters}${digits}`;
  };

  // Function to handle form submission
  const onFinish = async (values: any) => {
    let payload = {
      ...values,
      WorkID: id ? undefined : generateRandomWorkID(),
    };

    let res;
    try {
      if (id) {
        res = await UpdateWorkById(id, payload);
      } else {
        res = await CreateWork(payload);
      }

      if (res.status === 200 || res.status === 201) {
        messageApi.open({
          type: "success",
          content: id ? "แก้ไขข้อมูลสำเร็จ" : "สร้างข้อมูลสำเร็จ",
        });
        setTimeout(() => {
          navigate("/work");
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error submitting form",
      });
    }
  };

  return (
    <div>
      {contextHolder}
      <Row justify="center" style={{ marginTop: '40px' }}>
        <Col>
          <Button type="primary" onClick={() => navigate('/work')}>
            EDIT
          </Button>
        </Col>
        <Col>
          <Button type="primary" onClick={() => navigate('/go')}>
            PW
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <h1>{id ? "EDIT WORK" : "CREATE WORK"}</h1>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Space direction="vertical" size={30} style={{ textAlign: 'center' }}>
            {profileImage ? (
              <Avatar shape="square" size={200} src={profileImage} />
            ) : (
              <Avatar shape="square" size={200} style={{ backgroundColor: '#ccc' }}>No Image</Avatar>
            )}
            <Text>{firstName} {lastName}</Text>
          </Space>
        </Col>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Row gutter={[200, 16]} justify="center">
              <Col span={24} md={12}>
                <Form.Item
                  label="รายละเอียดงาน"
                  name="info"
                  rules={[{ required: true, message: 'กรุณากรอกข้อความเพิ่มเติมที่นี่' }]}
                >
                  <Input.TextArea
                    placeholder="กรุณากรอกข้อความเพิ่มเติมที่นี่"
                    style={{ width: '1000px', height: '300px', boxSizing: 'border-box' }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Form.Item
                    label="ค่าจ้าง"
                    name="wages"
                    rules={[{ required: true, message: 'กรุณากรอกข้อความที่นี่' }]}
                  >
                    <InputNumber min={0} max={10000000}
                      placeholder="กรุณากรอกข้อความที่นี่"
                      style={{ width: '100%', maxWidth: '300px', height: '40px' }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="หมวดหมู่"
                    name="category"
                    rules={[{ required: true, message: 'กรุณากรอกหมวดหมู่' }]}
                  >
                    <Input
                      placeholder="กรุณากรอกหมวดหมู่"
                      style={{ width: '100%', maxWidth: '300px', height: '40px' }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="อีเมล"
                    name="contact"
                    rules={[{ required: true, message: 'กรุณากรอกอีเมลของคุณ' }]}
                  >
                    <Input
                      placeholder="กรุณากรอกอีเมลของคุณ"
                      style={{ width: '100%', maxWidth: '300px', height: '40px' }}
                    />
                  </Form.Item>
                </Space>
              </Col>
            </Row>
            <Form.Item>
              <div style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  style={{
                    height: '50px',
                    maxWidth: '100px',
                  }}
                >
                  {id ? 'แก้ไขข้อมูล' : 'บันทึกข้อมูล'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Row>
    </div>
  );
}
