package recovery

import (
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func New(logger *logrus.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				path := c.Request.URL.Path
				statusCode := c.Writer.Status()
				clientIP := c.ClientIP()
				clientUserAgent := c.Request.UserAgent()
				logger.Errorf("%s - \"%s %s\" %d \"%s\" - recovered from panic: %v\n%s",
					clientIP, c.Request.Method, path, statusCode, clientUserAgent, r, debug.Stack(),
				)
				c.AbortWithStatus(http.StatusInternalServerError)
			}
		}()
		c.Next()
	}
}
