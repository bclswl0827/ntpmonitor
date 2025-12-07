.PHONY: build digest clean run gen

GO ?= go

SRC_DIR = ./cmd/ntpmonitor
DIST_DIR = ./build

BINARY = ntpmonitor
ifeq (${GOOS}, windows)
    BINARY := $(BINARY).exe
endif

BUILD_ARGS = -v -trimpath
BUILD_FLAGS = -s -w

build:
	@echo "[Info] Building project, output file path: $(DIST_DIR)/$(BINARY)"
	@mkdir -p $(DIST_DIR)
	CGO_ENABLED=0 GOOS=${GOOS} GOARCH=${GOARCH} GOARM=${GOARM} GOMIPS=${GOMIPS} \
		$(GO) build -ldflags="$(BUILD_FLAGS)" $(BUILD_ARGS) -o $(DIST_DIR)/$(BINARY) $(SRC_DIR)/*.go
	@echo "[Info] Build completed."

digest:
ifneq ($(wildcard $(DIST_DIR)/$(BINARY)),)
	@openssl dgst -md5 $(DIST_DIR)/$(BINARY)* | awk '{print "MD5=" $$2}'
	@openssl dgst -sha1 $(DIST_DIR)/$(BINARY)* | awk '{print "SHA1=" $$2}'
	@openssl dgst -sha256 $(DIST_DIR)/$(BINARY)* | awk '{print "SHA2-256=" $$2}'
	@openssl dgst -sha512 $(DIST_DIR)/$(BINARY)* | awk '{print "SHA2-512=" $$2}'
else
	@echo "[Error] Binary $(DIST_DIR)/$(BINARY) not found, please build first."
	@exit 1
endif

run:
	@mkdir -p $(DIST_DIR)
	@echo "[Info] Running project..."
	$(GO) run -gcflags="all=-N -l" -race $(SRC_DIR)/*.go -database $(DIST_DIR)/states.db.local

clean:
	@echo "[Warn] Cleaning up project..."
	@rm -rf $(DIST_DIR)/*

gen:
ifeq ($(shell command -v gqlgen 2> /dev/null),)
	@echo "[Info] Installing gqlgen..."
	@$(GO) get github.com/99designs/gqlgen
	@$(GO) install github.com/99designs/gqlgen
endif
	@echo "[Info] Generating GraphQL code..."
	@gqlgen generate
