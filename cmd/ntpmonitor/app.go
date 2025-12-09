package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/bclswl0827/ntpmonitor/internal/dao"
	"github.com/bclswl0827/ntpmonitor/internal/dao/action"
	"github.com/bclswl0827/ntpmonitor/internal/dao/model"
	"github.com/bclswl0827/ntpmonitor/internal/server"
	"github.com/bclswl0827/ntpmonitor/internal/server/graph_resolver"
	"github.com/bclswl0827/ntpmonitor/internal/service"
	"github.com/bclswl0827/ntpmonitor/internal/service/clock_drift_measurement"
	"github.com/bclswl0827/ntpmonitor/internal/service/ntp_offset_measurement"
	"github.com/bclswl0827/ntpmonitor/internal/service/polling_reference_server"
	"github.com/bclswl0827/ntpmonitor/internal/settings"
	"github.com/bclswl0827/ntpmonitor/pkg/logger"
	"github.com/bclswl0827/ntpmonitor/pkg/message"
	"github.com/samber/lo"
)

func appStart(args arguments) {
	if err := setupLogger(args.logLevel); err != nil {
		logger.GetLogger(main).Fatalln(err)
	}

	if args.password == "" {
		logger.GetLogger(main).Fatalln("you must set a password to prevent unauthorized changes to the settings.")
	}

	daoObj := dao.New(args.database)
	if err := daoObj.Open(); err != nil {
		logger.GetLogger(main).Fatalln(err)
	}

	logger.GetLogger(main).Info("database connection has been established")

	if err := daoObj.Migrate(
		&model.ClockDrifts{},
		&model.NtpServers{},
		&model.ServerOffsets{},
		&model.UserSettings{},
	); err != nil {
		logger.GetLogger(main).Fatalln(err)
	}

	logger.GetLogger(main).Info("database schema has been configured")

	actionHandler := action.New(daoObj)
	if err := settings.Init(actionHandler); err != nil {
		logger.GetLogger(main).Fatalln(err)
	}

	logger.GetLogger(main).Info("default settings has been initialized")

	messageBus := message.NewBus[polling_reference_server.Response]()
	pollingReferenceServer, remoteTimeFn := polling_reference_server.New(actionHandler, messageBus)
	backgroundServices := []service.IService{
		pollingReferenceServer,
		ntp_offset_measurement.New(actionHandler, messageBus, remoteTimeFn),
		clock_drift_measurement.New(actionHandler, messageBus, remoteTimeFn),
	}
	for _, serviceObj := range backgroundServices {
		serviceObj.Start()
		logger.GetLogger(main).Infof("service %s has been started", serviceObj.Name())
	}

	httpServer := server.New(
		&graph_resolver.Resolver{
			Password:      args.password,
			ActionHandler: actionHandler,
			RemoteTimeFn:  remoteTimeFn,
		},
		logger.GetLogger("http_server"),
	)
	if err := httpServer.Setup(args.listen); err != nil {
		logger.GetLogger(main).Fatalln(err)
	}
	go func() {
		if err := httpServer.Start(); err != nil {
			logger.GetLogger(main).Fatalln(err)
		}
	}()

	logger.GetLogger(main).Info("http server has been started")

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, os.Interrupt, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	defer signal.Stop(signalChan)

	<-signalChan
	logger.GetLogger(main).Warnln("interrupt signal received (e.g. Ctrl+C), shutting down...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	done := make(chan struct{})
	go func() {
		defer close(done)

		if err := httpServer.Stop(); err != nil {
			logger.GetLogger(main).Errorf("failed to stop http server: %v", err)
		}

		for _, serviceObj := range backgroundServices {
			serviceObj.Stop()
			logger.GetLogger(main).Infof("service %s has been stopped", serviceObj.Name())
		}
	}()

	handleExit := func(reason string, warn bool) {
		if warn {
			logger.GetLogger(main).Warn(reason)
		} else {
			logger.GetLogger(main).Info(reason)
		}
		os.Exit(lo.Ternary(warn, 1, 0))
	}
	select {
	case <-done:
		handleExit("program exited successfully, goodbye", false)
	case <-shutdownCtx.Done():
		handleExit("shutdown timed out, forcing exit", true)
	}
}
