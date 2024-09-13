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
	var resume entity.Resume
	if err := c.ShouldBindJSON(&resume); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// Save Personal if provided
	if resume.PersonalID != 0 {
		if err := db.Create(&resume.Personal).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create personal data"})
			return
		}
		resume.PersonalID = resume.Personal.ID
	}

	// Save Study if provided
	if resume.StudyID != 0 {
		if err := db.Create(&resume.Study).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create study data"})
			return
		}
		resume.StudyID = resume.Study.ID
	}

	// Save Experience if provided
	if resume.ExperienceID != 0 {
		if err := db.Create(&resume.Experience).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create experience data"})
			return
		}
		resume.ExperienceID = resume.Experience.ID
	}

	// Save Skill if provided
	if resume.SkillID != 0 {
		if err := db.Create(&resume.Skill).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create skill data"})
			return
		}
		resume.SkillID = resume.Skill.ID
	}

	// Save Resume
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
