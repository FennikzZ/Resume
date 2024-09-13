import moment from 'moment';

// ข้อมูลส่วนตัว
export interface PersonalInterface {
  id?: number; // Primary key
  first_name?: string;
  last_name?: string;
  address?: string;
  province?: string;
  phone_number?: string;
  email?: string;
  Profile?: string; // URL หรือ base64 ของรูปโปรไฟล์
}

// ข้อมูลการศึกษา
export interface StudyInterface {
  id?: number; // Primary key
  education?: string;
  institution?: string;
  year?: string;
}

// ข้อมูลประสบการณ์
export interface ExperienceInterface {
  id?: number; // Primary key
  JobTitle?: string;
  company?: string;
  startDate?: moment.Moment; // ใช้ moment สำหรับการจัดการวันที่
  endDate?: moment.Moment;
}

// ข้อมูลทักษะ
export interface SkillInterface {
  id?: number; // Primary key
  skill1?: string;
  level1?: number;
  skill2?: string;
  level2?: number;
  skill3?: string;
  level3?: number;
}

// ข้อมูลประวัติ
export interface ResumeInterface {
  id: number; // Primary key

  personal_id: number; // Foreign key
  personal?: PersonalInterface; // Optional

  study_id: number; // Foreign key
  study?: StudyInterface; // Optional

  experience_id: number; // Foreign key
  experience?: ExperienceInterface; // Optional

  skill_id: number; // Foreign key
  skill?: SkillInterface; // Optional
}
