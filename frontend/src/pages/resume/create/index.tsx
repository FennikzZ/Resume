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
import { useNavigate } from 'react-router-dom';
import { CreateResume as CreateResumeService } from '../../../services/https';
import { ResumeInterface } from '../../../interfaces/IResume';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined } from '@ant-design/icons';
import { RcFile, UploadFile } from 'antd/es/upload';

const { TabPane } = Tabs;

const CreateResume = () => {
  const [activeTab, setActiveTab] = useState('1');
  const tabContentRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    personal: { first_name: '', last_name: '', address: '', province: '', phone_number: '', email: '', Profile: '' },
    study: { education: '', institution: '', year: '' },
    experience: { JobTitle: '', company: '', startDate: null, endDate: null },
    skill: { skill1: '', level1: 50, skill2: '', level2: 50, skill3: '', level3: 50 },
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFormChange = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const onFinish = async (values: ResumeInterface) => {
    try {
      if (values.personal) {
        values.personal.Profile = fileList[0]?.thumbUrl || ''; // Add profile image URL if available
      }
      let res = await CreateResumeService(values);

      console.log('Response:', res);

      if (res && res.status === 200) {
        message.success('ข้อมูลได้ถูกบันทึกเรียบร้อยแล้ว');
        setTimeout(() => {
          navigate('/resume');
        }, 2000);
      } else {
        message.error(res?.data?.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('บันทึกข้อมูลไม่สำเร็จ');
    }
  };

  const handleCancel = () => {
    navigate('/resume');
  };

  const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList.slice(-1)); // Keep only the latest file
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  useEffect(() => {
    if (tabContentRef.current[activeTab]) {
      tabContentRef.current[activeTab]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
            สร้าง Resume
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
                    <Form.Item
                      name={['personal', 'Profile']}
                      valuePropName="fileList"
                      getValueFromEvent={(e: { fileList: UploadFile[] }) => e.fileList}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ImgCrop rotationSlider>
                          <Upload
                            fileList={fileList}
                            onChange={handleFileChange}
                            onPreview={onPreview}
                            beforeUpload={() => false} // Prevent auto-upload
                            listType="picture-card"
                          >
                            {fileList.length === 0 && (
                              <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>อัพโหลดรูปภาพ</div>
                              </div>
                            )}
                          </Upload>
                        </ImgCrop>
                      </div>
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="ชื่อจริง" name={['personal', 'first_name']} initialValue={formData.personal.first_name}>
                          <Input placeholder="กรุณากรอกชื่อจริง" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="นามสกุล" name={['personal', 'last_name']} initialValue={formData.personal.last_name}>
                          <Input placeholder="กรุณากรอกนามสกุล" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="ที่อยู่" name={['personal', 'address']} initialValue={formData.personal.address}>
                          <Input placeholder="กรุณากรอกที่อยู่" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="จังหวัด" name={['personal', 'province']} initialValue={formData.personal.province}>
                          <Input placeholder="กรุณากรอกจังหวัด" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="หมายเลขโทรศัพท์" name={['personal', 'phone_number']} initialValue={formData.personal.phone_number}>
                          <Input placeholder="กรุณากรอกหมายเลขโทรศัพท์" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="อีเมล" name={['personal', 'email']} initialValue={formData.personal.email}>
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
                    <Form.Item label="การศึกษา" name={['study', 'education']} initialValue={formData.study.education}>
                      <Input placeholder="กรุณากรอกการศึกษา" />
                    </Form.Item>
                    <Form.Item label="สถาบัน" name={['study', 'institution']} initialValue={formData.study.institution}>
                      <Input placeholder="กรุณากรอกสถาบัน" />
                    </Form.Item>
                    <Form.Item label="ปีจบการศึกษา" name={['study', 'year']} initialValue={formData.study.year}>
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
                    <Form.Item label="ตำแหน่งงาน" name={['experience', 'JobTitle']} initialValue={formData.experience.JobTitle}>
                      <Input placeholder="กรุณากรอกตำแหน่งงาน" />
                    </Form.Item>
                    <Form.Item label="บริษัท" name={['experience', 'company']} initialValue={formData.experience.company}>
                      <Input placeholder="กรุณากรอกบริษัท" />
                    </Form.Item>
                    <Form.Item label="เริ่มงาน" name={['experience', 'startDate']} initialValue={formData.experience.startDate}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="สิ้นสุดงาน" name={['experience', 'endDate']} initialValue={formData.experience.endDate}>
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
                        <Form.Item label="ทักษะที่ 1" name={['skill', 'skill1']} initialValue={formData.skill.skill1}>
                          <Input placeholder="กรุณากรอกทักษะที่ 1" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="ระดับทักษะที่ 1" name={['skill', 'level1']} initialValue={formData.skill.level1}>
                          <Slider min={0} max={100} />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Row for Skill 2 */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="ทักษะที่ 2" name={['skill', 'skill2']} initialValue={formData.skill.skill2}>
                          <Input placeholder="กรุณากรอกทักษะที่ 2" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="ระดับทักษะที่ 2" name={['skill', 'level2']} initialValue={formData.skill.level2}>
                          <Slider min={0} max={100} />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Row for Skill 3 */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item label="ทักษะที่ 3" name={['skill', 'skill3']} initialValue={formData.skill.skill3}>
                          <Input placeholder="กรุณากรอกทักษะที่ 3" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="ระดับทักษะที่ 3" name={['skill', 'level3']} initialValue={formData.skill.level3}>
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
};

export default CreateResume;
