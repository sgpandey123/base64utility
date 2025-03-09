# Base64 Encoder/Decoder Chrome Extension

A powerful Chrome extension that allows you to encode text to Base64 and decode Base64 text directly from the context menu. The extension preserves all characters, including newlines, special characters, and Unicode text.

## Features

- 🔄 Encode any text to Base64
- 🔍 Decode Base64 text back to original format
- 💪 Supports all Unicode characters
- ✨ Preserves newlines and special characters
- 📋 Automatic clipboard copy
- 🔔 Notification feedback for all operations
- 🌐 Works on any webpage
- 🔒 Secure local processing (no data sent to servers)

## Installation

### From Chrome Web Store
1. Visit the Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the extension directory

## Usage

1. Select any text on a webpage
2. Right-click the selected text
3. Choose either:
   - "Encode to Base64" to convert text to Base64
   - "Decode from Base64" to convert Base64 back to text
4. The result will be automatically copied to your clipboard
5. A notification will confirm the operation

## Examples

### Encoding
- Input: `Hello, World!`
- Output: `SGVsbG8sIFdvcmxkIQ==`

### Decoding
- Input: `SGVsbG8sIFdvcmxkIQ==`
- Output: `Hello, World!`

### Special Characters
- Preserves newlines (\n)
- Handles Unicode characters (emoji, international text)
- Maintains formatting

## Permissions Explained

The extension requires the following permissions:

- `contextMenus`: To add the encode/decode options to the right-click menu
- `clipboardWrite`: To copy results to your clipboard
- `notifications`: To show operation success/failure notifications
- `activeTab`: To access the current tab for clipboard operations
- `scripting`: To inject the clipboard code into the active page

## Privacy & Security

- ✅ All encoding/decoding is done locally in your browser
- ✅ No data is sent to external servers
- ✅ No data collection or tracking
- ✅ Open source code for transparency

## Technical Details

- Uses UTF-8 encoding for proper character handling
- Implements standard Base64 encoding (RFC 4648)
- Preserves all Unicode characters
- Handles edge cases and invalid inputs gracefully

