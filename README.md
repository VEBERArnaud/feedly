# Feedly OPML Generator

A TypeScript tool that generates OPML files for importing RSS feeds into Feedly with a 2-level folder architecture.

## Features

- Generates valid OPML 2.0 files
- Organizes feeds in a `Category / Subcategory` folder structure
- Properly escapes XML special characters
- Validates feed structure with detailed error messages
- Includes curated feeds across Tech, Business, Sports, and News categories

## Requirements

- Node.js 24+ (see `.nvmrc` for version)

## Installation

```bash
npm install
```

## Usage

```bash
npm run generate
```

This generates a `feedly.opml` file in the current directory that can be imported into Feedly.

## Development

```bash
npm run build        # Compile TypeScript
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Feed Categories

| Category         | Subcategories                                                                   |
| ---------------- | ------------------------------------------------------------------------------- |
| Tech             | Web & Software, Cloud & DevOps, Architecture & Engineering, Data & AI, Security |
| Business         | Freelance & Productivity, Market & Finance, SaaS & Entrepreneurship             |
| Sports           | Formule 1, Motorsport, Baseball, Judo                                           |
| Actu Générale    | France, International                                                           |
| Tech Watch Light | Watch                                                                           |

## Adding or Modifying Feeds

Edit `feeds.json`. Each feed requires:

```json
{
  "title": "Feed Name",
  "xmlUrl": "https://example.com/feed.xml",
  "htmlUrl": "https://example.com/"
}
```

## License

MIT
