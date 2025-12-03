# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Node.js script that generates OPML files for importing RSS feeds into Feedly. Feeds are organized in a 2-level folder structure (`Category / Subcategory`).

## Commands

```bash
# Generate the OPML file
node generate-opml.js
```

This outputs `feedly.opml` in the current directory.

## Architecture

- `generate-opml.js` - Main script that reads feeds.json, validates structure, and outputs OPML 2.0 XML
- `feeds.json` - Feed configuration with nested structure: `Category > Subcategory > [feeds]`
- `.releaserc.json` - Semantic release config that attaches `feedly.opml` to GitHub releases

## Feed Structure

Each feed in `feeds.json` requires three fields:

- `title`: Display name
- `xmlUrl`: RSS/Atom feed URL
- `htmlUrl`: Website URL

The script validates this structure and exits with error if invalid.

## CI/CD

On push to main, GitHub Actions runs `generate-opml.js` and creates a release with the OPML file attached via semantic-release. Commits must follow conventional commit format for versioning.

## Node Version

Uses Node.js 24 (specified in `.nvmrc`).
