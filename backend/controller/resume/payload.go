package resume

import (
    "gorm.io/gorm"

)

type Personal struct {
    gorm.Model
    FirstName   string `json:"first_name"`
    LastName    string `json:"last_name"`
    Address     string `json:"address"`
    Province    string `json:"province"`
    PhoneNumber string `json:"phone_number"`
    Email       string `json:"email"`
    Profile   string `gorm:"type:longtext"`
}

type Study struct {
    gorm.Model
    Education   string `json:"education"`
    Institution string `json:"institution"`
    Year         string `json:"year"`
}

type Experience struct {
    gorm.Model
    JobTitle    string `json:"jobTitle"`
    Company     string `json:"company"`
    StartDate   string `json:"startDate"` // ใช้ string แทน time.Time
    EndDate     string `json:"endDate"`   // ใช้ string แทน time.Time
}

type Skill struct {
    gorm.Model
    Skill1       string `json:"skill1"`
    Level1       int    `json:"level1"`
    Skill2       string `json:"skill2"`
    Level2       int    `json:"level2"`
    Skill3       string `json:"skill3"`
    Level3       int    `json:"level3"`
}

type CreateResumePayload struct {
    PersonalID   uint `json:"personal_id"`
    StudyID      uint `json:"study_id"`
    ExperienceID uint `json:"experience_id"`
    SkillID      uint `json:"skill_id"`
    UserID       uint `json:"user_id"`

}

type UpdateResumePayload struct {
    ResumeID     uint `json:"resume_id"`
    PersonalID   uint `json:"personal_id"`
    StudyID      uint `json:"study_id"`
    ExperienceID uint `json:"experience_id"`
    SkillID      uint `json:"skill_id"`

}