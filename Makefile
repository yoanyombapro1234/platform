TAG?=latest
PATCH_VERSION?=$(shell jq -r '.version' package.json | awk -F'[".]' '{ printf "%s.%s.%d", $$1, $$2, $$3+1 }')
MINOR_VERSION?=$(shell jq -r '.version' package.json | awk -F'[".]' '{ printf "%s.%d.0", $$1, $$2+1 }')
MAJOR_VERSION?=$(shell jq -r '.version' package.json | awk -F'[".]' '{ printf "%d.0.0", $$1+1 }')
VERSION:=$(shell jq -r '.version' package.json)
NAME:=solomon-ai
EXTENSION_ID=production
CLIENT_ID=457682587397-3kbnst3tfbbrdv8vmblcmto6ciat63hc.apps.googleusercontent.com
CLIENT_SECRET=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
REFRESH_TOKEN=1//015Qj5vJ3Zm3QCgYIARAAGAESNwF-L9IrG-JLjAyv0FToWp5sPQ4X-PNl9RZQ0i93CpXvPIGK9XKHhL0PK5lWOGTTY4sklqhT9ac

format:
	npm run format

release-extension:
	@echo "Releasing to webstore"
	@echo "Building..."
	npm run build
	@echo "Zipping..."
	zip -r -FS solomon-ai-$(VERSION).zip build
	@echo "Uploading..."
	chrome-webstore-upload upload --source solomon-ai-$(VERSION).zip --extension-id $(EXTENSION_ID) --client-id $(CLIENT_ID) --client-secret $(CLIENT_SECRET) --refresh-token $(REFRESH_TOKEN)
	@echo "Done"

storybook:
	npm run storybook