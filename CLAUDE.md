# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A TypeScript/Node.js tool that generates OPML files for importing RSS feeds into Feedly. Feeds are organized in a 2-level folder structure (`Category / Subcategory`).

## Commands

```bash
npm install          # Install dependencies
npm run generate     # Generate feedly.opml
npm run build        # Compile TypeScript to dist/
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run format:check # Check formatting
```

## Architecture

```
src/
├── index.ts        # Main entry point
├── types.ts        # TypeScript interfaces (Feed, FeedsData, ValidationResult)
├── validator.ts    # Feed data validation
├── xml-utils.ts    # XML attribute escaping
└── opml-builder.ts # OPML document generation

tests/              # Vitest unit tests
feeds.json          # Feed configuration data
```

## Feed Structure

Each feed in `feeds.json` requires three fields:

- `title`: Display name
- `xmlUrl`: RSS/Atom feed URL
- `htmlUrl`: Website URL

The validator rejects invalid structures with detailed error messages.

## CI/CD

On push to main, GitHub Actions:

1. Runs lint, format check, tests, and build
2. Generates the OPML file
3. Creates a release with the OPML file attached via semantic-release

Pull requests trigger the test job only.

## Tech Stack

- Node.js 24 (ESM)
- TypeScript 5.7
- Vitest for testing
- ESLint 9 + Prettier
- Husky + lint-staged for pre-commit hooks
