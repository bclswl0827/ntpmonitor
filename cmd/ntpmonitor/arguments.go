package main

import "flag"

type arguments struct {
	database string
	listen   string
	logLevel string
}

func parseCommandLine() (args arguments) {
	flag.StringVar(&args.database, "database", "./states.db", "Path to database file (will be created if not exists)")
	flag.StringVar(&args.listen, "listen", "0.0.0.0:6060", "Listen address for web interface")
	flag.StringVar(&args.logLevel, "log-level", "info", "Log level [info|warn|error]")

	flag.Parse()

	return args
}
