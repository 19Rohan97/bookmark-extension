# Smart Bookmark Exporter

A lightweight Chrome Extension that allows you to bookmark the current webpage with **categories** and **tags**, then export all your saved bookmarks in **Markdown format**—perfect for use in **Obsidian** and **Notion**.

## Features

- Bookmark any page directly from the popup
- Add **Category** and **Tags**
- View or edit later via Chrome Storage (local)
- Export bookmarks as a **well-structured Markdown file**
- Fully compatible with **Markdown editors** like Obsidian and Notion

## Preview

![popup](./screenshots/popup-preview.png)

## Installation

1. Clone or download this repository.
2. Go to `chrome://extensions/` in your Chrome browser.
3. Enable **Developer Mode** (toggle in the top-right).
4. Click **Load Unpacked** and select the project folder.
5. Pin the extension to your toolbar and start bookmarking!

## Usage

1. Navigate to any webpage you want to save.
2. Click the extension icon.
3. Fill in:
   - **Category** (e.g., Productivity, Inspiration)
   - **Tags** (comma-separated, e.g., AI, Tools)
4. Click **Save**.
5. To export all your bookmarks, click **Export Markdown**.

## Export Format (Markdown Example)

```markdown
# Bookmarks Export

## Productivity

- [ChatGPT - OpenAI](https://chat.openai.com)
  - Tags: AI, Tools
  - Date: 04/22/2025
```
