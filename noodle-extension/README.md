# Noodle Chrome Extension

Ask questions and get AI-powered answers from GPT-4o-mini using your accumulated memory context.

## Features

- **Right-click to Noodle**: Single context menu item "Noodle"
- **Keyboard Shortcut**: `Ctrl+Shift+N` (or `Cmd+Shift+N` on Mac)
- **Beautiful Modal**: Clean, responsive interface
- **OpenAI Integration**: Direct calls to GPT-4o-mini with your memory as context
- **Local Memory Access**: Reads memory data stored by the Add to Memory extension

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `noodle-extension` folder

## Setup

### First Time Setup
1. Edit `background.js` and replace `YOUR_OPENAI_API_KEY_HERE` with your actual OpenAI API key
2. Get your API key at: https://platform.openai.com/api-keys
3. Load the extension in Chrome

Your API key is stored in the code and never shared with external services except OpenAI.

## Usage

### Via Right-click
1. Right-click anywhere on a webpage
2. Select "Noodle"
3. Type your question and press Enter

### Via Keyboard Shortcut
1. Press `Ctrl+Shift+N` (or `Cmd+Shift+N` on Mac)
2. Type your question and press Enter

## How It Works

1. **Reads Your Memory**: Accesses memory entries saved by the Add to Memory extension
2. **Builds Context**: Sends your memory as context to GPT-4o-mini
3. **Gets Smart Answers**: GPT-4o-mini answers your questions using your accumulated knowledge

## OpenAI Integration

- **Model**: GPT-4o-mini (cost-effective and fast)
- **Max Tokens**: 1000 (adjustable in code)
- **Temperature**: 0.7 (balanced creativity)
- **Context**: Your entire memory buffer is included in each request

## Privacy

- API key stored locally in Chrome
- Memory data never leaves your machine except to OpenAI
- No data sent to any other servers

## Works Best With

Use this extension alongside the **memorize** extension to build up context from web pages first.

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