// WorkEdit.tsx
import { useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { WorkInterface } from "../../../interfaces/Work";
import { GetWorkById, UpdateWorkById } from "../../../services/https/index";
import { useNavigate, Link, useParams } from "react-router-dom";

function WorkEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const getWorkById = async (id: string) => {
    let res = await GetWorkById(id);

    if (res.status === 200) {
      form.setFieldsValue({
        work_id: res.data.work_id,
        info: res.data.info,
        wages: res.data.wages,
        contact: res.data.contact,
        category: res.data.category,
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
  };

  const onFinish = async (values: WorkInterface) => {
    const res = await UpdateWorkById(id!, values);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: "บันทึกข้อมูลสำเร็จ",
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
  };

  useEffect(() => {
    if (id) {
      getWorkById(id);
    }
  }, [id]);

  return (
    <div>
      {contextHolder}
      <Card>
        <h2>แก้ไขข้อมูลงาน</h2>
        <Divider />
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Work ID"
                name="work_id"
                rules={[{ required: true, message: "กรุณากรอก Work ID!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="รายละเอียดงาน"
                name="info"
                rules={[{ required: true, message: "กรุณากรอกรายละเอียดงาน!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ค่าจ้าง"
                name="wages"
                rules={[{ required: true, message: "กรุณากรอกค่าจ้าง!" }]}
              >
                <InputNumber min={0} max={10000000} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ข้อมูลการติดต่อ"
                name="contact"
                rules={[{ required: true, message: "กรุณากรอกข้อมูลการติดต่อ!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="หมวดหมู่"
                name="category"
                rules={[{ required: true, message: "กรุณากรอกหมวดหมู่!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Link to="/work">
                    <Button htmlType="button" style={{ marginRight: "10px" }}>
                      ยกเลิก
                    </Button>
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<PlusOutlined />}
                  >
                    บันทึก
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default WorkEdit;
