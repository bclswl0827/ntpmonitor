package ntpclient

import (
	"errors"
	"fmt"
	"strings"
)

func FixHostPort(address string, defaultPort int) (fixed string, err error) {
	if address == "" {
		return "", errors.New("address string is empty")
	}

	// If the address is wrapped in brackets, append a port if necessary.
	if address[0] == '[' {
		end := strings.IndexByte(address, ']')
		switch {
		case end < 0:
			return "", errors.New("missing ']' in address")
		case end+1 == len(address):
			return fmt.Sprintf("%s:%d", address, defaultPort), nil
		case address[end+1] == ':':
			return address, nil
		default:
			return "", errors.New("unexpected character following ']' in address")
		}
	}

	// No colons? Must be a port-less IPv4 or domain address.
	last := strings.LastIndexByte(address, ':')
	if last < 0 {
		return fmt.Sprintf("%s:%d", address, defaultPort), nil
	}

	// Exactly one colon? A port have been included along with an IPv4 or
	// domain address. (IPv6 addresses are guaranteed to have more than one
	// colon.)
	prev := strings.LastIndexByte(address[:last], ':')
	if prev < 0 {
		return address, nil
	}

	// Two or more colons means we must have an IPv6 address without a port.
	return fmt.Sprintf("[%s]:%d", address, defaultPort), nil
}
