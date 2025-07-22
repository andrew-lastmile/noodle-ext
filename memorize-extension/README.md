# memorize Chrome Extension

Quickly add web pages, text selections, and links to a local memory file for AI context.

## Features

- **Right-click to Add**: Single context menu item "memorize"
- **Multiple Content Types**: Supports pages, text selections, images, and links
- **Local Storage**: Accumulates entries in Chrome's local storage
- **Download Memory**: Click extension icon or use context menu to download all entries
- **Toast Notifications**: Instant feedback when content is added

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `add-to-memory-extension` folder

## Usage

### Adding to Memory
1. Right-click on any webpage, text selection, or link
2. Select "memorize"
3. Content is saved to local storage
4. Toast notification shows current entry count

### Downloading Memory File
1. Click the extension icon in the toolbar, or
2. Right-click on the extension icon → "Download Memory File"
3. Choose where to save your `memory-YYYY-MM-DD.txt` file

## Memory File Format

Each entry includes:
- Timestamp
- Content type (page, selection, link)
- URL
- Page title
- Selected text (if any)

Example:
```
--- Memory Entry [2024-01-01T12:00:00.000Z] ---
Type: selection
URL: https://example.com
Title: Example Page
Selected Text: Important information here
```

## Works Best With

Use this extension alongside the **noodle** extension to ask questions about your accumulated memory.

## Design Color Schema

The extensions use a consistent color theme for UI elements:

### Color Palette
- **White Base** - `#FFFFFF`: Main backgrounds, primary surface
- **Light Slate** - `#C2CFE0`: Bowl fill, steam highlights, borders, disabled states
- **Steel Blue** - `#7D9CC0`: Inner bowl shade, noodle shadow, placeholder text
- **Deep Blue** - `#0C4885`: Primary stroke & outlines, main text color
- **Sky Blue** - `#41A0DC`: Accent tone, focus states, interactive elements
- **Midnight Blue** - `#0E498A`: Inner edge, depth tone, gradient end

### Usage Guidelines
- Use **White Base** for primary backgrounds and content areas
- Apply **Light Slate** for subtle borders, input field borders, and disabled states
- Use **Steel Blue** for secondary text like placeholders and loading states
- Apply **Deep Blue** for primary text content and main outlines
- Use **Sky Blue** for interactive elements, focus states, and primary buttons
- Apply **Midnight Blue** for depth and shadow effects in gradients

This color scheme creates a cohesive, professional appearance across both extensions while maintaining accessibility and visual hierarchy.