import { useState, useEffect } from "react";
import { Space, Table, Col, Row, Divider, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetPostwork } from "../../services/https/index";
import { PostworkInterface } from "../../interfaces/Postwork";
import dayjs from "dayjs";

function Postwork() {
  const [postworks, setPostworks] = useState<PostworkInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns: ColumnsType<PostworkInterface> = [
    {
      title: "ลำดับ",
      dataIndex: "ID",
      key: "id",
    },
    {
      title: "ID ผู้ใช้",
      dataIndex: "id_user",
      key: "id_user",
    },
    {
      title: "ID งาน",
      dataIndex: "id_work",
      key: "id_work",
    },
    {
      title: "ชื่อผู้ใช้",
      key: "user_first_name",
      render: (record) => <>{record?.User?.first_name}</>,
    },
    {
      title: "นามสกุลผู้ใช้",
      key: "user_last_name",
      render: (record) => <>{record?.User?.last_name}</>,
    },
    {
      title: "ชื่องาน",
      key: "work_info",
      render: (record) => <>{record?.Work?.info}</>,
    },
    {
      title: "หมวดหมู่งาน",
      key: "work_category",
      render: (record) => <>{record?.Work?.category}</>,
    },
    {
      title: "ค่าจ้าง",
      key: "work_wages",
      render: (record) => <>{record?.Work?.wages}</>,
    },
  ];

  const getPostworks = async () => {
    let res = await GetPostwork();
    if (res.status == 200) {
      setPostworks(res.data);
    } else {
      setPostworks([]);
      messageApi.open({
        type: "error",
        content: res.data.error,
      });
    }
  };

  useEffect(() => {
    getPostworks();
  }, []);

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={12}>
          <h2>รายการ Postwork</h2>
        </Col>
      </Row>
      <Divider />
      <div style={{ marginTop: 20 }}>
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={postworks}
          style={{ width: "100%", overflow: "scroll" }}
        />
      </div>
    </>
  );
}

export default Postwork;
