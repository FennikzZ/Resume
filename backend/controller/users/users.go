package users


import (

   "net/http"


   "github.com/gin-gonic/gin"


   "example.com/sa-67-example/config"

   "example.com/sa-67-example/entity"

)


func GetAll(c *gin.Context) {


   var users []entity.Users


   db := config.DB()

   results := db.Preload("Gender").Find(&users)

   if results.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})

       return

   }

   c.JSON(http.StatusOK, users)


}


func Get(c *gin.Context) {


   ID := c.Param("id")

   var user entity.Users


   db := config.DB()

   results := db.Preload("Gender").First(&user, ID)

   if results.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})

       return

   }

   if user.ID == 0 {

       c.JSON(http.StatusNoContent, gin.H{})

       return

   }

   c.JSON(http.StatusOK, user)


}


func Update(c *gin.Context) {


   var user entity.Users


   UserID := c.Param("id")


   db := config.DB()

   result := db.First(&user, UserID)

   if result.Error != nil {

       c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})

       return

   }


   if err := c.ShouldBindJSON(&user); err != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})

       return

   }


   result = db.Save(&user)

   if result.Error != nil {

       c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})

       return

   }


   c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})

}


func Delete(c *gin.Context) {
    id := c.Param("id")

    db := config.DB()

    // Start a transaction
    tx := db.Begin()

    // Delete associated Postwork entries
    if err := tx.Where("iduser = ?", id).Delete(&entity.Postwork{}).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete associated Postwork entries"})
        return
    }

    // Delete the User
    if err := tx.Delete(&entity.Users{}, id).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete user"})
        return
    }

    // Commit the transaction
    tx.Commit()

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func GetUserProfile(c *gin.Context) {
    // Extract user email from the context
    email, _ := c.Get("userEmail")

    var user entity.Users
    db := config.DB()

    result := db.Preload("Gender").Where("email = ?", email).First(&user)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    // Return user profile details
    c.JSON(http.StatusOK, gin.H{
        "Profile": user.Profile, // Ensure this field exists in your `Users` model
        "FirstName": user.FirstName,
        "LastName": user.LastName,
    })
}


// Mock function to extract user ID from the token
func extractUserIDFromToken(token string) (uint, error) {
    // Implement your token parsing and validation logic here
    // This is a placeholder function
    return 1, nil // Replace with actual implementation
}