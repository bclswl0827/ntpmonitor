package main

import (
	"fmt"

	"github.com/bclswl0827/ntpmonitor/pkg/logger"
	"github.com/common-nighthawk/go-figure"
)

func init() {
	ntp := figure.NewFigure("NTP", "standard", true).String()
	monitor := figure.NewFigure("Monitor", "standard", true).String()
	fmt.Printf("%s%s\n\nStarting...\r", ntp, monitor)
	logger.Init()
}

func main() {
	args := parseCommandLine()
	appStart(args)
}
