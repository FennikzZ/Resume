package resume

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"example.com/sa-67-example/config"
	"example.com/sa-67-example/entity"
)

func CreateResume(c *gin.Context) {
    var payload struct {
        PersonalID   uint `json:"personal_id"`
        StudyID      uint `json:"study_id"`
        ExperienceID uint `json:"experience_id"`
        SkillID      uint `json:"skill_id"`
    }

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // ดึงข้อมูลของผู้ใช้ที่ล็อคอินอยู่จาก context (หรือจาก token)
    user, exists := c.Get("user")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    // แปลงข้อมูลผู้ใช้เป็น type ที่ต้องการ
    userID, ok := user.(uint)
    if !ok {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user data"})
        return
    }

    // สร้าง Resume ใหม่
    resume := entity.Resume{
        PersonalID:   payload.PersonalID,
        StudyID:      payload.StudyID,
        ExperienceID: payload.ExperienceID,
        SkillID:      payload.SkillID,
        UserID:       userID, // ใช้ UserID ของผู้ใช้ที่ล็อคอินอยู่
    }

    // ตรวจสอบข้อมูลที่เชื่อมโยงกับ Resume
    if resume.PersonalID != 0 {
        var personal entity.Personal
        if err := db.First(&personal, resume.PersonalID).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Personal data not found"})
            return
        }
        resume.Personal = personal
    } else if resume.Personal.FirstName != "" {
        if err := db.Create(&resume.Personal).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create personal data"})
            return
        }
        resume.PersonalID = resume.Personal.ID
    }

    if resume.StudyID != 0 {
        var study entity.Study
        if err := db.First(&study, resume.StudyID).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Study data not found"})
            return
        }
        resume.Study = study
    } else if resume.Study.Education != "" {
        if err := db.Create(&resume.Study).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create study data"})
            return
        }
        resume.StudyID = resume.Study.ID
    }

    if resume.ExperienceID != 0 {
        var experience entity.Experience
        if err := db.First(&experience, resume.ExperienceID).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Experience data not found"})
            return
        }
        resume.Experience = experience
    } else if resume.Experience.JobTitle != "" {
        if err := db.Create(&resume.Experience).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create experience data"})
            return
        }
        resume.ExperienceID = resume.Experience.ID
    }

    if resume.SkillID != 0 {
        var skill entity.Skill
        if err := db.First(&skill, resume.SkillID).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Skill data not found"})
            return
        }
        resume.Skill = skill
    } else if resume.Skill.Skill1 != "" {
        if err := db.Create(&resume.Skill).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create skill data"})
            return
        }
        resume.SkillID = resume.Skill.ID
    }

    // บันทึก Resume
    if err := db.Create(&resume).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create resume"})
        return
    }

    c.JSON(http.StatusOK, resume)
}

func GetAllResume(c *gin.Context) {
	db := config.DB()
	var resumes []entity.Resume

	if err := db.Preload("Personal").Preload("Study").Preload("Experience").Preload("Skill").Find(&resumes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resumes)
}

func GetResume(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var resume entity.Resume

	if err := db.Preload("Personal").Preload("Study").Preload("Experience").Preload("Skill").First(&resume, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบ Resume"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resume)
}

func UpdateResume(c *gin.Context) {
	ResumeID := c.Param("id")
	db := config.DB()
	var resume entity.Resume

	if err := db.First(&resume, ResumeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&resume); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	if err := db.Save(&resume).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DeleteResume(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var resume entity.Resume

	// ตรวจสอบว่า resume มีอยู่ในฐานข้อมูลหรือไม่
	if err := db.First(&resume, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบ Resume"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// ลบข้อมูลที่เกี่ยวข้อง
	if resume.PersonalID != 0 {
		if err := db.Delete(&entity.Personal{}, resume.PersonalID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบข้อมูล Personal ได้"})
			return
		}
	}

	if resume.StudyID != 0 {
		if err := db.Delete(&entity.Study{}, resume.StudyID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบข้อมูล Study ได้"})
			return
		}
	}

	if resume.ExperienceID != 0 {
		if err := db.Delete(&entity.Experience{}, resume.ExperienceID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบข้อมูล Experience ได้"})
			return
		}
	}

	if resume.SkillID != 0 {
		if err := db.Delete(&entity.Skill{}, resume.SkillID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบข้อมูล Skill ได้"})
			return
		}
	}

	// ลบ resume
	if err := db.Delete(&resume).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถลบ Resume ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบ Resume สำเร็จ"})
}
