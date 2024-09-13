import { useState, useEffect } from "react";
import { Space, Button, Col, Row, Divider, message, Input, Card, Typography, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { GetResume, DeleteResumeById } from "../../services/https/index"; // Import necessary functions

const { Title } = Typography;

interface Personal {
  first_name: string;
  last_name: string;
  address: string;
  province: string;
  phone_number: string;
  email: string;
  Profile?: string;
}

interface Study {
  education: string;
  institution: string;
  year: string;
}

interface Experience {
  JobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  skill1: string;
  level1: number;
  skill2: string;
  level2: number;
  skill3: string;
  level3: number;
}

interface Resume {
  ID: string;
  personal: Personal;
  study: Study;
  experience: Experience;
  skill: Skill;
}

// Helper function to get a display value or default
const getDisplayValue = (value: string | undefined | null, defaultValue: string = '-') => {
  return value ?? defaultValue;
};

const ResumeMain = () => {
  const [resumeData, setResumeData] = useState<Resume[]>([]);
  const [filteredData, setFilteredData] = useState<Resume[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState<string>('');
  const navigate = useNavigate();

  const handleDelete = async (id: string) => {
    try {
      let res = await DeleteResumeById(id);
      if (res.status === 200) {
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
        await getResumeData(); // Reload data after deletion
      } else {
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดที่ไม่คาดคิด.",
      });
    }
  };

  const getResumeData = async () => {
    try {
      let res = await GetResume();
      if (res.status === 200) {
        setResumeData(res.data);
        setFilteredData(res.data);
      } else {
        setResumeData([]);
        setFilteredData([]);
        messageApi.open({
          type: "error",
          content: res.data.error,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดที่ไม่คาดคิด.",
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    if (value) {
      const filtered = resumeData.filter(resume => {
        return (getDisplayValue(resume.personal?.first_name).toLowerCase().includes(value) ||
          getDisplayValue(resume.personal?.last_name).toLowerCase().includes(value) ||
          getDisplayValue(resume.experience?.JobTitle).toLowerCase().includes(value));
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(resumeData);
    }
  };

  useEffect(() => {
    getResumeData();
  }, []);

  return (
    <>
      {contextHolder}
      <Row gutter={16}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={2} style={{ color: '#06579b', fontSize: '70px', textTransform: 'uppercase',  letterSpacing: '10px' }}>
            RESUME
          </Title>
        </Col>
      </Row>
      <Row gutter={16} style={{ justifyContent: 'center', marginTop: '20px' }}>
          <Col>
            <Link to="/resume/create">
              <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: '#06579b', borderColor: '#06579b', borderRadius: '5px' }}>
                สร้างเรซูเม่
              </Button>
            </Link>
          </Col>
        </Row>
      <Divider />
      <Card style={{ backgroundColor: '#f7f9fc', borderRadius: '10px', padding: '20px', margin: 'auto', width: '100%' }}>
        <Row gutter={16} style={{ justifyContent: 'center' }}>
          {filteredData.map((resume) => (
            <Col span={8} key={resume.ID} style={{ marginBottom: 16 }}>
              <Card
                style={{
                  borderRadius: '10px',
                  border: '1px solid #06579b',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#ffffff',
                }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flexShrink: 0, marginRight: '16px' }}>
                      {resume.personal?.Profile && (
                        <Image
                          width={100}
                          height={100}
                          src={resume.personal.Profile}
                          alt="Profile"
                          style={{ borderRadius: '20%' }}
                        />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#06579b' }}>
                        ID : {resume.ID}
                      </div>
                      <div>
                        {`${getDisplayValue(resume.personal?.first_name, '-')}`} {`${getDisplayValue(resume.personal?.last_name, '-')}`}
                      </div>
                    </div>
                  </div>
                }
                extra={
                  <div>
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/resume/view/${resume.ID}`)}
                      style={{ marginRight: 8, backgroundColor: '#06579b', borderColor: '#06579b', borderRadius: '5px' }}
                    >
                      ดู
                    </Button>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => navigate(`/resume/edit/${resume.ID}`)}
                      style={{ marginRight: 8, backgroundColor: '#06579b', borderColor: '#06579b', borderRadius: '5px' }}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      type="dashed"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(resume.ID)}
                      style={{ borderColor: '#06579b', borderRadius: '5px' }}
                    >
                      ลบ
                    </Button>
                  </div>
                }
              >
                <p><strong>ตำแหน่ง:</strong> {getDisplayValue(resume.experience?.JobTitle)}</p>
                <p><strong>บริษัท:</strong> {getDisplayValue(resume.experience?.company)}</p>
                <p><strong>ชื่อ:</strong> {getDisplayValue(resume.personal?.first_name)} {getDisplayValue(resume.personal?.last_name)}</p>
                <p><strong>ที่อยู่:</strong> {getDisplayValue(resume.personal?.address)}</p>
                <p><strong>จังหวัด:</strong> {getDisplayValue(resume.personal?.province)}</p>
                <p><strong>โทรศัพท์:</strong> {getDisplayValue(resume.personal?.phone_number)}</p>
                <p><strong>อีเมล:</strong> {getDisplayValue(resume.personal?.email)}</p>
                <p><strong>การศึกษา:</strong> {getDisplayValue(resume.study?.education)} ที่ {getDisplayValue(resume.study?.institution)} ({getDisplayValue(resume.study?.year)})</p>
                <p><strong>ทักษะ:</strong></p>
                <p>{getDisplayValue(resume.skill?.skill1)}: {resume.skill?.level1 ?? 0}%</p>
                <p>{getDisplayValue(resume.skill?.skill2)}: {resume.skill?.level2 ?? 0}%</p>
                <p>{getDisplayValue(resume.skill?.skill3)}: {resume.skill?.level3 ?? 0}%</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </>
  );
};

export default ResumeMain;
