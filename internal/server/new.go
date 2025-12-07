package server

import (
	"github.com/bclswl0827/ntpmonitor/internal/server/graph_resolver"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func init() {
	gin.SetMode(gin.ReleaseMode)
}

func New(resolver *graph_resolver.Resolver, logger *logrus.Entry) *httpServer {
	return &httpServer{
		log:      logger,
		resolver: resolver,
	}
}
