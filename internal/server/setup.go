package server

import (
	"compress/gzip"
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"runtime/debug"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/bclswl0827/ntpmonitor/internal/server/graph_resolver"
	"github.com/bclswl0827/ntpmonitor/internal/server/middleware/httplog"
	"github.com/bclswl0827/ntpmonitor/internal/server/middleware/recovery"
	"github.com/bclswl0827/ntpmonitor/web"
	"github.com/gin-contrib/cors"
	gzipHandler "github.com/gin-contrib/gzip"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func (s *httpServer) Setup(listen string) error {
	s.engine = gin.New()

	s.engine.Use(recovery.New(s.log.Logger))
	s.engine.Use(httplog.New(s.log))
	s.engine.Use(gzipHandler.Gzip(gzip.BestCompression))

	s.engine.NoRoute(func(ctx *gin.Context) {
		uri := ctx.Request.RequestURI
		msg := fmt.Sprintf("resource not found on %s", uri)
		ctx.String(http.StatusNotFound, msg)
	})

	graphql := handler.NewDefaultServer(graph_resolver.NewExecutableSchema(graph_resolver.Config{Resolvers: s.resolver}))
	graphql.SetRecoverFunc(func(ctx context.Context, err any) (userMessage error) {
		s.log.Errorf("recovered from panic in GraphQL: %v\n%s", err, debug.Stack())
		return errors.New("fatal error occured")
	})

	if os.Getenv("DEBUG") != "" {
		s.engine.Use(cors.New(cors.Config{
			MaxAge:        12 * time.Hour,
			AllowOrigins:  []string{"*"},
			ExposeHeaders: []string{"Content-Length", "Content-Disposition"},
			AllowMethods:  []string{"GET", "POST", "PATCH"},
			AllowHeaders:  []string{"Content-Type", "Authorization"},
		}))
		s.engine.GET("/graphql", func(ctx *gin.Context) {
			writer, request := ctx.Writer, ctx.Request
			playground.Handler("GraphQL API Debug", request.URL.Path).ServeHTTP(writer, request)
		})
	}
	s.engine.POST("/graphql", func(ctx *gin.Context) {
		graphql.ServeHTTP(ctx.Writer, ctx.Request)
	})

	webFs, webPath := web.NewEmbedFs()
	vfs, err := static.EmbedFolder(webFs, webPath)
	if err != nil {
		return err
	}
	s.engine.Use(static.Serve("/", vfs))

	s.server.Addr = listen
	s.server.Handler = s.engine.Handler()

	return nil
}
