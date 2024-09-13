import { useEffect, useState } from "react";
import { Col, Row, Card, Typography, Image, Spin, Alert, Button, Progress } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { GetResumeById } from "../../../services/https/index";
import { InfoCircleOutlined, PhoneOutlined, MailOutlined, HomeOutlined, IdcardOutlined, RadarChartOutlined, LaptopOutlined, BookOutlined, ToolOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

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

// Utility function to format date
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return ''; // ถ้าไม่มีวันที่ ให้คืนค่าว่าง
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // ตรวจสอบว่าข้อมูลวันที่ถูกต้องหรือไม่
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const ViewResume = () => {
    const { id } = useParams<{ id: string }>();
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            setError("ไม่พบ ID ของเรซูเม่");
            setLoading(false);
            return;
        }

        const fetchResume = async () => {
            try {
                const res = await GetResumeById(id);
                if (res.status === 200) {
                    setResume(res.data);
                } else {
                    setError(`Error: ${res.data.error || 'Failed to load resume'}`);
                }
            } catch (error) {
                setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message={error} type="error" showIcon />;
    if (!resume) return <div>ไม่พบข้อมูลเรซูเม่</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Row
                gutter={16}
                style={{
                    display: 'flex',
                    justifyContent: 'center', // จัดให้คอลัมน์อยู่ตรงกลางแนวนอน
                    alignItems: 'center', // จัดให้คอลัมน์อยู่ตรงกลางแนวตั้ง (ถ้าต้องการ)
                }}
            >
                <Col span={14}>
                    <Card
                        style={{
                            backgroundColor: '#eaf4fc',
                            position: 'relative',
                            border: '20px solid #06579b'
                        }}
                    >
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 1, paddingRight: '16px', borderRight: '1px solid #ddd' }}>
                                {/* ข้อมูลส่วนตัว */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                                    <Title
                                        level={4}
                                        style={{
                                            marginBottom: '24px',
                                            fontSize: '36px', // เพิ่มขนาดฟอนต์
                                            fontWeight: 'bold', // เพิ่มความหนาของฟอนต์
                                            color: '#06579b', // ใช้สีที่เด่น
                                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' // เพิ่มเงาให้กับข้อความ
                                        }}
                                    >
                                        RESUME
                                    </Title>

                                    {resume.personal.Profile && (
                                        <Image
                                            width={220}
                                            height={220}
                                            src={resume.personal.Profile}
                                            alt="Profile"
                                            style={{ borderRadius: '20%', marginBottom: '16px' }}
                                        />
                                    )}
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginTop: '20px' }}>
                                            <Paragraph>
                                                <IdcardOutlined style={{ marginRight: '8px' }} />
                                                <strong>ชื่อ:</strong> {resume.personal.first_name} {resume.personal.last_name}
                                            </Paragraph>
                                            <Paragraph>
                                                <HomeOutlined style={{ marginRight: '8px' }} />
                                                <strong>ที่อยู่:</strong> {resume.personal.address}
                                            </Paragraph>
                                            <Paragraph>
                                                <HomeOutlined style={{ marginRight: '8px' }} />
                                                <strong>จังหวัด:</strong> {resume.personal.province}
                                            </Paragraph>
                                            <Paragraph>
                                                <PhoneOutlined style={{ marginRight: '8px' }} />
                                                <strong>โทรศัพท์:</strong> {resume.personal.phone_number}
                                            </Paragraph>
                                            <Paragraph>
                                                <MailOutlined style={{ marginRight: '8px' }} />
                                                <strong>อีเมล:</strong> {resume.personal.email}
                                            </Paragraph>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ flex: 2, paddingLeft: '16px' }}>
                                {/* ข้อมูลการศึกษา */}
                                <Title level={4}><BookOutlined style={{ marginRight: '8px' }} />การศึกษา</Title>
                                <Paragraph><strong>การศึกษา:</strong> {resume.study.education}</Paragraph>
                                <Paragraph><strong>สถาบัน:</strong> {resume.study.institution}</Paragraph>
                                <Paragraph><strong>ปีที่จบ:</strong> {resume.study.year}</Paragraph>

                                {/* ประสบการณ์การทำงาน */}
                                <Title level={4} style={{ marginTop: '16px' }}><LaptopOutlined style={{ marginRight: '8px' }} />ประสบการณ์การทำงาน</Title>
                                <Paragraph><strong>ตำแหน่ง:</strong> {resume.experience.JobTitle}</Paragraph>
                                <Paragraph><strong>บริษัท:</strong> {resume.experience.company}</Paragraph>
                                <Paragraph><strong>ระยะเวลา:</strong> {formatDate(resume.experience.startDate)} ถึง {formatDate(resume.experience.endDate)}</Paragraph>

                                {/* ทักษะ */}
                                <Title level={4} style={{ marginTop: '16px' }}><RadarChartOutlined style={{ marginRight: '8px' }} />ทักษะ</Title>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <Paragraph style={{ margin: 0, flex: 1 }}>
                                            <strong>{resume.skill.skill1}:</strong>
                                            <Progress percent={resume.skill.level1} strokeColor="#52c41a" strokeWidth={24} style={{ flex: 2 }} />
                                        </Paragraph>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <Paragraph style={{ margin: 0, flex: 1 }}>
                                            <strong>{resume.skill.skill2}:</strong>
                                            <Progress percent={resume.skill.level2} strokeColor="#1890ff" strokeWidth={24} style={{ flex: 2 }} />
                                        </Paragraph>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <Paragraph style={{ margin: 0, flex: 1 }}>
                                            <strong>{resume.skill.skill3}:</strong>
                                            <Progress percent={resume.skill.level3} strokeColor="#f5222d" strokeWidth={24} style={{ flex: 2 }} />
                                        </Paragraph>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                            <Button
                                onClick={() => navigate('/resume')}
                                style={{ backgroundColor: '#06579b', color: '#fff', border: 'none' }}
                            >
                                ย้อนกลับ
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ViewResume;
