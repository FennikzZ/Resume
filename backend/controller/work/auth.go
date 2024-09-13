package work

import (
    "math/rand"
    "net/http"
    "time"
    "github.com/gin-gonic/gin"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "log" // Import log package for debugging
)

type WorkPayload struct {
  WorkID    string  `json: "work_id"`
    Info     string `json:"info"`
    Wages    uint   `json:"wages"`
    Contact  string `json:"contact"`
    Category string `json:"category"`
}

// Generate a random WorkID: 4 digits
func generateRandomWorkID() string {
    digits := []rune("0123456789")

    rand.Seed(time.Now().UnixNano())

    WorkID := make([]rune, 4)
    for i := 0; i < 4; i++ {
        WorkID[i] = digits[rand.Intn(len(digits))]
    }

    return string(WorkID)
}

// Ensure that the WorkID is unique in the database
func isWorkIDUnique(WorkID string) bool {
    db := config.DB()
    var work entity.Work
    result := db.Where("work_id = ?", WorkID).First(&work)
    return result.RowsAffected == 0
}

func CreateWorks(c *gin.Context) {
    var payload WorkPayload

    // Bind the request JSON to WorkPayload struct
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Generate a unique WorkID
    var WorkID string
    for {
        WorkID = generateRandomWorkID()
        if isWorkIDUnique(WorkID) {
            break
        }
    }

    // Create a new Work entity
    work := entity.Work{
        WorkID:   WorkID,
        Info:     payload.Info,
        Wages:    payload.Wages,
        Contact:  payload.Contact,
        Category: payload.Category,
    }

    // Save the Work entity to the database
    db := config.DB()
    if err := db.Create(&work).Error; err != nil {
        log.Println("Error saving Work entity:", err) // Log the error for debugging
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Return success response with the generated WorkID
    c.JSON(http.StatusCreated, gin.H{"message": "Work created successfully", "work_id": work.WorkID})
}
