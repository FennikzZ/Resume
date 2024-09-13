import { useState, useEffect } from "react";
import { Space, Table, Button, Col, Row, Divider, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { GetWork, DeleteWorkById } from "../../services/https/index";
import { WorkInterface } from "../../interfaces/Work";
import { Link, useNavigate } from "react-router-dom";

function Work() {
  const navigate = useNavigate();
  const [work, setWorks] = useState<WorkInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const myId = localStorage.getItem("id");

  const columns: ColumnsType<WorkInterface> = [
    {
      title: "",
      render: (record) =>
        myId === record?.ID ? null : (
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteWorkById(record.ID)}
          />
        ),
    },
    {
      title: "ลำดับ",
      dataIndex: "work_id",
      key: "work_id",
    },
    {
      title: "รายละเอียดงาน",
      dataIndex: "info",
      key: "info",
    },
    {
      title: "ค่าจ้าง",
      dataIndex: "wages",
      key: "wages",
    },
    {
      title: "ติดต่อ",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "หมวดหมู่",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "",
      render: (record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/work/edit/${record.ID}`)}
        >
          แก้ไขข้อมูล
        </Button>
      ),
    },
  ];
  

  const deleteWorkById = async (id: string) => {
    let res = await DeleteWorkById(id);

    if (res.status === 200) {
      messageApi.open({
        type: "success",
        content: "ลบข้อมูลสำเร็จ",
      });
      await getWorks();
    } else {
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  const getWorks = async () => {
    let res = await GetWork();

    if (res.status === 200) {
      setWorks(res.data);
    } else {
      setWorks([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getWorks();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>จัดการข้อมูลงาน</h2>
        </Col>
        <Col span={12} style={{ textAlign: "end", alignSelf: "center" }}>
          <Space>
            <Link to="/work/create">
              <Button type="primary" icon={<PlusOutlined />}>
                สร้างข้อมูล
              </Button>
            </Link>
          </Space>
        </Col>
      </Row>
      <Divider />
      <Table columns={columns} dataSource={work} />
    </>
  );
}

export default Work;
