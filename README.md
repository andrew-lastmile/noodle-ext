# Noodle extensions

A pair of Chrome extensions that work together to create an AI-powered memory system for your browsing.

## Extensions

### 🥄 memorize
Captures web content to build your memory context:
- Right-click any webpage to save clean text content
- Automatically strips CSS, JavaScript, and non-essential elements  
- Stores selected text, links, and full pages
- Download your memory as a text file
- Toast notifications for feedback

### 🍜 noodle  
Ask questions about your accumulated memory:
- Right-click anywhere to open AI chat interface
- Contextual ribbon UI that doesn't interrupt browsing
- Uses GPT-4o-mini with your memory as context
- Includes selected text from current page
- Memory limited to 20 most recent entries for efficiency

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" 
4. Click "Load unpacked" and select each extension folder:
   - `memorize-extension/`
   - `noodle-extension/`

## Usage Workflow

1. **Collect**: Use **memorize** to right-click and save interesting content as you browse
2. **Query**: Use **noodle** to right-click and ask questions about what you've collected
3. **Learn**: Get AI answers that reference your specific saved context

## Design

Both extensions use a cohesive color theme:
- **White Base** (#FFFFFF): Clean backgrounds
- **Light Slate** (#C2CFE0): Subtle borders and disabled states  
- **Steel Blue** (#7D9CC0): Secondary text and placeholders
- **Deep Blue** (#0C4885): Primary text and outlines
- **Sky Blue** (#41A0DC): Interactive elements and focus states
- **Midnight Blue** (#0E498A): Depth and gradient effects

## Architecture

- **Cross-extension communication**: Uses localStorage for sharing memory data
- **Clean content extraction**: Removes ads, navigation, and styling to capture core content
- **Memory management**: Limits context to prevent API token overflow
- **Non-intrusive UI**: Ribbon design that overlays without disrupting workflow

## Development

Each extension is self-contained with its own manifest, background script, and assets. The extensions communicate through shared localStorage rather than Chrome extension messaging APIs.

## Upcoming Features

- [Better personalization] Better support for multimedia (images)
- [Better personalization] Remote memory storage for access to memories across instances
- [Better personalization] Collection of memories
- [Better personalization] GraphDB for better retrieval and search
- [Latency] memory compaction

## Privacy

- Memory data stored locally in Chrome
- Only shared with OpenAI for AI responses
- No external tracking or analytics
- API keys stored locally
