package postwork

import (
    "net/http"
    "example.com/sa-67-example/config"
    "example.com/sa-67-example/entity"
    "github.com/gin-gonic/gin"
)

func Create(c *gin.Context) {
    var postwork entity.Postwork

    if err := c.ShouldBindJSON(&postwork); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()
    if err := db.Create(&postwork).Error; err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Postwork created successfully", "postwork": postwork})
}

func GetAll(c *gin.Context) {
   var postworks []entity.Postwork

   db := config.DB()

   // Use Preload to fetch associated Users and Work entities
   results := db.Preload("User").Preload("Work").Find(&postworks)

   if results.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
       return
   }

   c.JSON(http.StatusOK, postworks)
}

func Get(c *gin.Context) {
   ID := c.Param("id")
   var postwork entity.Postwork

   // Get a reference to the database
   db := config.DB()

   // Fetch the Postwork record by ID with preloaded User and Work entities
   result := db.Preload("User").Preload("Work").First(&postwork, ID)

   // Handle errors if the record is not found
   if result.Error != nil {
       c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
       return
   }

   // Return the Postwork record as JSON
   c.JSON(http.StatusOK, postwork)
}

func Delete(c *gin.Context) {
    ID := c.Param("id")

    db := config.DB()
    // Start a transaction to ensure atomicity
    tx := db.Begin()

    // Delete the Postwork entry
    if err := tx.Delete(&entity.Postwork{}, ID).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusNotFound, gin.H{"error": "Failed to delete Postwork entry"})
        return
    }

    // Commit the transaction
    tx.Commit()

    c.JSON(http.StatusOK, gin.H{"message": "Postwork deleted successfully"})
}