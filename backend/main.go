package main

import (
	"net/http" // เพิ่มการนำเข้าแพ็คเกจ net/http
	"github.com/gin-gonic/gin"
	"example.com/sa-67-example/config"
	"example.com/sa-67-example/controller/genders"
	"example.com/sa-67-example/controller/resume"
	"example.com/sa-67-example/controller/users"
	"example.com/sa-67-example/middlewares"
)

const PORT = "8000"

func main() {
	// เปิดการเชื่อมต่อไปยังฐานข้อมูล
	config.ConnectionDB()

	// สร้างฐานข้อมูล
	config.SetupDatabase()

	r := gin.Default()

	// ใช้ CORS middleware
	r.Use(CORSMiddleware())

	// เส้นทางสำหรับการลงทะเบียนและเข้าสู่ระบบ
	r.POST("/signup", users.SignUp)
	r.POST("/signin", users.SignIn)

	// เส้นทางที่ต้องการการอนุญาต
	protected := r.Group("/")
	protected.Use(middlewares.Authorizes())

	// เส้นทางสำหรับผู้ใช้
	protected.PUT("/user/:id", users.Update)
	protected.GET("/users", users.GetAll)
	protected.GET("/user/:id", users.Get)
	protected.DELETE("/user/:id", users.Delete)
	
	// เส้นทางสำหรับเรซูเม่
    protected.POST("/resumes", resume.CreateResume)
    protected.GET("/resumes", resume.GetAllResume)
    protected.GET("/resumes/:id", resume.GetResume)
    protected.PUT("/resumes/:id", resume.UpdateResume)
    protected.DELETE("/resumes/:id", resume.DeleteResume)
    
	// เส้นทางสำหรับเพศ
	r.GET("/genders", genders.GetAll)

	// เส้นทางรูท
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// เริ่มเซิร์ฟเวอร์
	r.Run("localhost:" + PORT)
}

// CORSMiddleware ตั้งค่า CORS headers
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
