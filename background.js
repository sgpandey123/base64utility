// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated, creating context menu items');
  chrome.contextMenus.create({
    id: "encode-base64",
    title: "Encode to Base64",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "decode-base64", 
    title: "Decode from Base64",
    contexts: ["selection"]
  });
  console.log('Context menu items created successfully');
});

// Base64 encoding and decoding functions
const Base64 = {
  characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  
  encode: function(input) {
    console.log('Custom Base64 encoding started');
    
    // Convert string to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(input);
    console.log('UTF-8 bytes:', utf8Bytes);
    
    let output = '';
    let i = 0;
    
    // Process three bytes at a time
    while (i < utf8Bytes.length) {
      const byte1 = utf8Bytes[i++];
      const byte2 = i < utf8Bytes.length ? utf8Bytes[i++] : null;
      const byte3 = i < utf8Bytes.length ? utf8Bytes[i++] : null;
      
      // Encode the first 6 bits of byte1
      const enc1 = byte1 >> 2;
      
      // Encode the remaining 2 bits of byte1 and first 4 bits of byte2
      const enc2 = ((byte1 & 3) << 4) | (byte2 !== null ? byte2 >> 4 : 0);
      
      // Encode the remaining 4 bits of byte2 and first 2 bits of byte3
      const enc3 = byte2 !== null ? ((byte2 & 15) << 2) | (byte3 !== null ? byte3 >> 6 : 0) : 64;
      
      // Encode the remaining 6 bits of byte3
      const enc4 = byte3 !== null ? byte3 & 63 : 64;
      
      // Add the encoded characters to the output
      output += this.characters.charAt(enc1) +
                this.characters.charAt(enc2) +
                this.characters.charAt(enc3) +
                this.characters.charAt(enc4);
    }
    
    console.log('Custom Base64 encoding completed');
    return output;
  },
  
  decode: function(input) {
    console.log('Custom Base64 decoding started');
    
    // Remove non-base64 characters (except whitespace)
    input = input.replace(/[^A-Za-z0-9+/=\s]/g, '');
    // Remove whitespace
    input = input.replace(/\s/g, '');
    
    const bytes = [];
    let i = 0;
    
    while (i < input.length) {
      // Get the numeric value of each character
      const enc1 = this.characters.indexOf(input.charAt(i++));
      const enc2 = this.characters.indexOf(input.charAt(i++));
      const enc3 = this.characters.indexOf(input.charAt(i++));
      const enc4 = this.characters.indexOf(input.charAt(i++));
      
      // Reconstruct the original bytes
      const byte1 = (enc1 << 2) | (enc2 >> 4);
      const byte2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const byte3 = ((enc3 & 3) << 6) | enc4;
      
      bytes.push(byte1);
      if (enc3 !== 64) bytes.push(byte2);
      if (enc4 !== 64) bytes.push(byte3);
    }
    
    // Convert bytes back to text
    const decoder = new TextDecoder();
    const output = decoder.decode(new Uint8Array(bytes));
    
    console.log('Custom Base64 decoding completed');
    return output;
  }
};

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('Context menu clicked:', info.menuItemId);
  const selectedText = info.selectionText;
  console.log('Selected text:', selectedText);

  let result;
  if (info.menuItemId === "encode-base64") {
    try {
      console.log('Starting Base64 encoding process');
      result = Base64.encode(selectedText);
      console.log('Final Base64 encoded result:', result);
    } catch (e) {
      console.error("Error encoding text:", e);
      console.error("Error details:", {
        message: e.message,
        stack: e.stack
      });
      showNotification("Error", "Failed to encode text. Make sure it contains valid characters.");
      return;
    }
  }

  if (info.menuItemId === "decode-base64") {
    try {
      console.log('Starting Base64 decoding process');
      result = Base64.decode(selectedText);
      console.log('Final decoded result:', result);
    } catch (e) {
      console.error("Error decoding text:", e);
      console.error("Error details:", {
        message: e.message,
        stack: e.stack
      });
      showNotification("Error", "Failed to decode text. Make sure it's valid Base64.");
      return;
    }
  }

  // Inject content script to handle clipboard operations
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: textToClipboard,
      args: [result]
    });
    showNotification("Success", "Result copied to clipboard!");
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    showNotification("Error", "Failed to copy to clipboard");
  }
});

// Function to be injected into the page
function textToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

// Helper function to show notifications
function showNotification(title, message) {
  console.log('Showing notification:', { title, message });
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon48.png',
    title: title,
    message: message
  }, (notificationId) => {
    console.log('Notification created with ID:', notificationId);
  });
} 