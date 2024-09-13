package entity

import (
    "gorm.io/gorm"
)

type Personal struct {
    gorm.Model
    FirstName   string `json:"first_name"` // แก้เป็น first_name
    LastName    string `json:"last_name"`  // แก้เป็น last_name
    Address     string `json:"address"`
    Province    string `json:"province"`
    PhoneNumber string `json:"phone_number"` // แก้เป็น phone_number
    Email       string `json:"email"`
    Profile     string `gorm:"type:longtext"`
}


type Study struct {
    gorm.Model
    Education   string `json:"education"`
    Institution string `json:"institution"`
    Year        string `json:"year"`
}

type Experience struct {
    gorm.Model
    JobTitle    string `json:"JobTitle"`
    Company     string `json:"company"`
    StartDate   string `json:"startDate"` // ใช้ string แทน time.Time
    EndDate     string `json:"endDate"`   // ใช้ string แทน time.Time
}

type Skill struct {
    gorm.Model
    Skill1 string `json:"skill1"`
    Level1 int    `json:"level1"`
    Skill2 string `json:"skill2"`
    Level2 int    `json:"level2"`
    Skill3 string `json:"skill3"`
    Level3 int    `json:"level3"`
}

type Resume struct {
    gorm.Model
    PersonalID   uint      `json:"personal_id"`
    Personal     Personal  `gorm:"foreignKey:PersonalID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"personal"`
    
    StudyID      uint      `json:"study_id"`
    Study        Study     `gorm:"foreignKey:StudyID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"study"`
    
    ExperienceID uint      `json:"experience_id"`
    Experience   Experience `gorm:"foreignKey:ExperienceID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"experience"`
    
    SkillID      uint      `json:"skill_id"`
    Skill        Skill     `gorm:"foreignKey:SkillID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"skill"`

     //เพิ่ม user
     UserID       uint      `json:"user_id"`
     User         Users     `gorm:"foreignKey:UserID;references:ID" json:"user"`
}