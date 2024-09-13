package work

import (
    "math/rand"
    "net/http"
    "time"
    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
)

const letterBytes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numberBytes = "0123456789"

// GenerateRandomWorkID generates a unique WorkID with 2 random letters and 3 random digits
func GenerateRandomWorkID() string {
    rand.Seed(time.Now().UnixNano())

    b := make([]byte, 2+3)
    for i := 0; i < 2; i++ {
        b[i] = letterBytes[rand.Intn(len(letterBytes))]
    }
    for i := 2; i < 5; i++ {
        b[i] = numberBytes[rand.Intn(len(numberBytes))]
    }
    return string(b)
}

// IsWorkIDUnique checks if the generated WorkID is unique in the database
func IsWorkIDUnique(workID string) bool {
    db := config.DB()
    var work entity.Work
    result := db.Where("work_id = ?", workID).First(&work)
    return result.RowsAffected == 0
}

// GetAll fetches all work entities
func GetAll(c *gin.Context) {
    var works []entity.Work

    db := config.DB()
    results := db.Find(&works)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, works)
}

// Get fetches a specific work entity by ID
func Get(c *gin.Context) {
    ID := c.Param("id")
    var work entity.Work

    db := config.DB()
    results := db.First(&work, ID)

    if results.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, work)
}

// Create handles the creation of a new work entity
func Create(c *gin.Context) {
    var work entity.Work

    // Generate a unique WorkID
    for {
        work.WorkID = GenerateRandomWorkID()
        if IsWorkIDUnique(work.WorkID) {
            break
        }
    }

    // Bind the JSON payload to the Work struct
    if err := c.ShouldBindJSON(&work); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // Save the new Work to the database
    if err := db.Create(&work).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Retrieve the email from the context
    email, exists := c.Get("userEmail")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
        return
    }

    // Find the user ID by email
    var user entity.Users
    result := db.Where("email = ?", email).First(&user)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find user"})
        return
    }

    // Create a new Postwork entry
    var postwork entity.Postwork
    postwork.IDuser = user.ID
    postwork.IDwork = work.ID

    if err := db.Create(&postwork).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Postwork"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Work created successfully", "work": work, "postwork": postwork})
}

// Update handles updating a specific work entity by ID
func Update(c *gin.Context) {
    ID := c.Param("id")
    var existingWork entity.Work

    db := config.DB()
    if err := db.First(&existingWork, ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    var updatedWork entity.Work
    if err := c.ShouldBindJSON(&updatedWork); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Update only the fields that are provided in the request
    db.Model(&existingWork).Updates(updatedWork)

    c.JSON(http.StatusOK, gin.H{"message": "Work updated successfully", "data": existingWork})
}

// Delete handles deleting a specific work entity by ID
func Delete(c *gin.Context) {
    ID := c.Param("id")

    db := config.DB()

    // Start a transaction
    tx := db.Begin()

    // Delete associated Postwork entries
    if err := tx.Where("idwork = ?", ID).Delete(&entity.Postwork{}).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete associated Postwork entries"})
        return
    }

    // Delete the Work
    if err := tx.Delete(&entity.Work{}, ID).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusNotFound, gin.H{"error": "Failed to delete work"})
        return
    }

    // Commit the transaction
    tx.Commit()

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}