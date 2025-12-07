package server

import (
	"net/http"

	"github.com/bclswl0827/ntpmonitor/internal/server/graph_resolver"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type httpServer struct {
	resolver *graph_resolver.Resolver
	log      *logrus.Entry
	engine   *gin.Engine
	server   http.Server
}
