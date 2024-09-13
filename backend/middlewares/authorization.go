package middlewares

import (
    "net/http"
    "strings"
    "example.com/sa-67-example/services"
    "github.com/gin-gonic/gin"
)

// Authorization middleware for validating JWT tokens
func Authorizes() gin.HandlerFunc {
    return func(c *gin.Context) {
        clientToken := c.Request.Header.Get("Authorization")

        if clientToken == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No Authorization header provided"})
            return
        }

        // Extract token from Bearer scheme
        extractedToken := strings.Split(clientToken, "Bearer ")
        if len(extractedToken) != 2 {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Format of Authorization Token"})
            return
        }
        clientToken = strings.TrimSpace(extractedToken[1])

        jwtWrapper := services.JwtWrapper{
            SecretKey: "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
            Issuer:    "AuthService",
        }

        claims, err := jwtWrapper.ValidateToken(clientToken)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
            return
        }

        // Add the claims (including email) to the context
        c.Set("userEmail", claims.Email)
        c.Next()
    }
}
