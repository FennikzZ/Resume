import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  Slider,
  Tabs,
  DatePicker,
  Upload,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ResumeInterface } from '../../../interfaces/IResume';
import { GetResumeById, UpdateResumeById } from "../../../services/https/index";
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/es/upload';
import dayjs from 'dayjs'; // ใช้ dayjs แทน moment

const { TabPane } = Tabs;

function EditResume() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [activeTab, setActiveTab] = useState('1');
  const tabContentRef = useRef<any>({});

  const fetchResumeById = async (id: string) => {
    try {
      const res = await GetResumeById(id);
      if (res.status === 200) {
        const { personal, study, experience, skill } = res.data;

        form.setFieldsValue({
          personal: {
            first_name: personal.first_name || '',
            last_name: personal.last_name || '',
            address: personal.address || '',
            province: personal.province || '',
            phone_number: personal.phone_number || '',
            email: personal.email || '',
            Profile: personal.Profile ? [{ url: personal.Profile, uid: '1', name: 'profile.jpg' }] : [],
          },
          study: {
            education: study.education || '',
            institution: study.institution || '',
            year: study.year || '',
          },
          experience: {
            JobTitle: experience?.JobTitle || '',
            company: experience?.company || '',
            startDate: experience?.startDate ? dayjs(experience.startDate) : null,
            endDate: experience?.endDate ? dayjs(experience.endDate) : null,
          },
          skill: {
            skill1: skill.skill1 || '',
            level1: skill.level1 || 0,
            skill2: skill.skill2 || '',
            level2: skill.level2 || 0,
            skill3: skill.skill3 || '',
            level3: skill.level3 || 0,
          },
        });

        if (personal.Profile) {
          setFileList([{ url: personal.Profile, uid: '1', name: 'profile.jpg' }]);
        }
      } else {
        messageApi.open({ type: 'error', content: 'ไม่พบข้อมูลประวัติ' });
        setTimeout(() => navigate("/resume"), 2000);
      }
    } catch (error) {
      messageApi.open({ type: 'error', content: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
  };

  const onFinish = async (values: ResumeInterface) => {
    if (typeof id !== 'string') {
      messageApi.open({ type: 'error', content: 'ID ไม่ถูกต้อง' });
      return;
    }

    try {
      // ใช้ URL ของไฟล์ใน fileList โดยตรง
      const profileUrl = fileList.length > 0 ? fileList[0].url : '';

      const payload = {
        ...values,
        personal: {
          ...values.personal,
          Profile: profileUrl, // ใช้ URL ของไฟล์
        },
        experience: values.experience ? {
          ...values.experience,
          startDate: values.experience.startDate?.toISOString(),
          endDate: values.experience.endDate?.toISOString(),
        } : {},
      };

      const res = await UpdateResumeById(id, payload);
      if (res.status === 200) {
        messageApi.open({ type: 'success', content: res.data.message });
        setTimeout(() => navigate("/resume"), 2000);
      } else {
        messageApi.open({ type: 'error', content: res.data.error });
      }
    } catch (error) {
      messageApi.open({ type: 'error', content: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
  };

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    // ตรวจสอบว่ามีไฟล์ใน fileList และนำ URL ของไฟล์ที่อัพโหลดไปเก็บ
    const newFileList = fileList.map(file => {
      if (file.url) {
        return file;
      }
      return {
        ...file,
        url: file.originFileObj ? URL.createObjectURL(file.originFileObj) : '',
      };
    });
    setFileList(newFileList);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    }
    // Display preview here
  };

  const handleCancel = () => navigate('/resume');

  useEffect(() => {
    if (typeof id === 'string') fetchResumeById(id);
  }, [id]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {contextHolder}
      <Card>
        <center>
          <h2
            style={{
              fontSize: '35px',
              border: '2px solid #1890ff',
              padding: '10px',
              borderRadius: '5px',
              display: 'inline-block',
              background: '#06579b',
              color: '#ffffff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            แก้ไข Resume
          </h2>
        </center>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              setTimeout(() => {
                if (tabContentRef.current[key]) {
                  tabContentRef.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 0);
            }}
            tabPosition="top"
            style={{ width: '100%', maxWidth: '800px', marginBottom: '20px' }}
          >
            <TabPane tab="ข้อมูลส่วนตัว" key="1">
              <div ref={(el) => (tabContentRef.current['1'] = el)}>
                <Form form={form} name="personal" layout="vertical" onFinish={onFinish} autoComplete="off">
                  <Card title={<span style={{ textAlign: 'center', display: 'block' }}>ข้อมูลส่วนตัว</span>} style={{ marginBottom: '20px' }}>
                    <Form.Item name={['personal', 'Profile']}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100px', // ปรับขนาดความสูงของพื้นที่ให้ปุ่มอยู่กลางจอ
                          width: '100%',
                        }}
                      >
                        <ImgCrop rotationSlider>
                          <Upload
                            fileList={fileList}
                            onChange={handleFileChange}
                            onPreview={handlePreview}
                            beforeUpload={() => false}
                            listType="picture-card"
                            maxCount={1} // จำกัดการอัพโหลดเพียงไฟล์เดียว
                          >
                            {fileList.length === 0 && (
                              <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>อัพโหลด</div>
                              </div>
                            )}
                          </Upload>
                        </ImgCrop>
                      </div>
                    </Form.Item>


                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="ชื่อจริง" name={['personal', 'first_name']}>
                          <Input placeholder="กรุณากรอกชื่อจริง" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="นามสกุล" name={['personal', 'last_name']}>
                          <Input placeholder="กรุณากรอกนามสกุล" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="ที่อยู่" name={['personal', 'address']}>
                          <Input placeholder="กรุณากรอกที่อยู่" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="จังหวัด" name={['personal', 'province']}>
                          <Input placeholder="กรุณากรอกจังหวัด" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="หมายเลขโทรศัพท์" name={['personal', 'phone_number']}>
                          <Input placeholder="กรุณากรอกหมายเลขโทรศัพท์" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="อีเมล" name={['personal', 'email']}>
                          <Input placeholder="กรุณากรอกอีเมล" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Form>
              </div>
            </TabPane>

            <TabPane tab="ข้อมูลการศึกษา" key="2">
              <div ref={(el) => (tabContentRef.current['2'] = el)}>
                <Form form={form} name="study" layout="vertical" onFinish={onFinish} autoComplete="off">
                  <Card title={<span style={{ textAlign: 'center', display: 'block' }}>การศึกษา</span>} style={{ marginBottom: '20px' }}>
                    <Form.Item label="การศึกษา" name={['study', 'education']}>
                      <Input placeholder="กรุณากรอกการศึกษา" />
                    </Form.Item>
                    <Form.Item label="สถาบัน" name={['study', 'institution']}>
                      <Input placeholder="กรุณากรอกสถาบัน" />
                    </Form.Item>
                    <Form.Item label="ปีจบการศึกษา" name={['study', 'year']}>
                      <Input placeholder="กรุณากรอกปีจบการศึกษา" />
                    </Form.Item>
                  </Card>
                </Form>
              </div>
            </TabPane>

            <TabPane tab="ประสบการณ์" key="3">
              <div ref={(el) => (tabContentRef.current['3'] = el)}>
                <Form form={form} name="experience" layout="vertical" onFinish={onFinish} autoComplete="off">
                  <Card title={<span style={{ textAlign: 'center', display: 'block' }}>ประสบการณ์</span>} style={{ marginBottom: '20px' }}>
                    <Form.Item label="ตำแหน่งงาน" name={['experience', 'JobTitle']}>
                      <Input placeholder="กรุณากรอกตำแหน่งงาน" />
                    </Form.Item>
                    <Form.Item label="บริษัท" name={['experience', 'company']}>
                      <Input placeholder="กรุณากรอกบริษัท" />
                    </Form.Item>
                    <Form.Item label="เริ่มงาน" name={['experience', 'startDate']}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="สิ้นสุดงาน" name={['experience', 'endDate']}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Card>
                </Form>
              </div>
            </TabPane>

            <TabPane tab="ทักษะ" key="4">
              <div ref={(el) => (tabContentRef.current['4'] = el)}>
                <Form form={form} name="skill" layout="vertical" onFinish={onFinish} autoComplete="off">
                  <Card title={<span style={{ textAlign: 'center', display: 'block' }}>ทักษะ</span>} style={{ marginBottom: '20px' }}>
                    {/* Row for Skill 1 */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="ทักษะที่ 1" name={['skill', 'skill1']}>
                          <Input placeholder="กรุณากรอกทักษะที่ 1" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="ระดับทักษะที่ 1" name={['skill', 'level1']}>
                          <Slider min={0} max={100} />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Row for Skill 2 */}
                    <Row gutter={16} style={{ marginTop: '10px' }}>
                      <Col span={12}>
                        <Form.Item label="ทักษะที่ 2" name={['skill', 'skill2']}>
                          <Input placeholder="กรุณากรอกทักษะที่ 2" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="ระดับทักษะที่ 2" name={['skill', 'level2']}>
                          <Slider min={0} max={100} />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Row for Skill 3 */}
                    <Row gutter={16} style={{ marginTop: '10px' }}>
                      <Col span={12}>
                        <Form.Item label="ทักษะที่ 3" name={['skill', 'skill3']}>
                          <Input placeholder="กรุณากรอกทักษะที่ 3" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="ระดับทักษะที่ 3" name={['skill', 'level3']}>
                          <Slider min={0} max={100} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Form>
              </div>
            </TabPane>
          </Tabs>

          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={() => form.submit()}>
              บันทึก
            </Button>
            <Button type="default" style={{ marginLeft: '10px' }} onClick={handleCancel}>
              ยกเลิก
            </Button>
          </Form.Item>
        </div>
      </Card>
    </div>
  );
}

export default EditResume;
