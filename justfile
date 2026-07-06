# © 2026 Konstantin Gredeskoul 

set shell := ["bash", "-eu", "-o", "pipefail", "-c"] 

set dotenv-load

version := `cat package.json | jq .version | tr -d '"'`
remote_folder := "kig@sopsy-cli.dev.:~/workspace/sopsy/dist"

[no-exit-message]
recipes:
    @just --choose

# Install bun (if missing) and then install project dependencies
setup:
    @command -v bun >/dev/null || curl -fsSL https://bun.sh/install | bash
    @bun install

# Start the Astro dev server at http://localhost:4321 or https://dev.kig.re/
dev: setup build
    @bash -c "sleep 3 && open http://127.0.0.1:4321" &
    @bun run dev --host

# Build production site into dist/
build: setup
    @bun run build

# Preview the production build locally
preview: build
    @bun run preview

# Format the whole repo with Prettier
format: setup
    @bun run format

# Verify formatting + types without writing (what CI enforces)
lint: setup
    @bun run lint

# Convert AsciiDoc posts to Markdown
convert:
    @bun run convert

# Generate the weekly AI digest post locally (needs one provider API key)
digest:
    @bun run digest

# Typecheck the tools/ TypeScript toolchain
typecheck:
    @bun run typecheck

# Deploy ./dist folder via rsync to the deploy destination
deploy: build
    @rsync -Pavz -e "ssh" ./dist/ {{ remote_folder }}

# Run automated tests
test:
    @bun test

# Run tests with coverage (text summary + coverage/lcov.info for Codecov)
coverage:
    @bun test --coverage --coverage-reporter=text --coverage-reporter=lcov

# Print the version of sopsy site
version: 
    @echo "Site version is {{ version }}"

# create a tag based on the version, push tags, and create a release
release:
    @git tag -f 'v{{ version }}'
    @git push --tags
    @gh release create --generate-notes

# Wipe ./dist and ./node_modules
clean:
    @echo "Removing ./dist..."
    @rm -rf dist
    @echo "Removing ./node_modules"
    @rm -rf node_modules

