// Noodle Chrome Extension Background Script

// Configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_API_KEY = "insert your api key"; // Replace with your actual OpenAI API key

// Get API key - now just returns the hardcoded key
function getApiKey() {
  return OPENAI_API_KEY;
}

// Create context menu item on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "noodle",
      title: "noodle",
      contexts: ["all"]
    });
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "noodle") {
    await handleNoodle(info, tab);
  }
});


// Handle "Noodle" action
async function handleNoodle(info, tab) {
  try {
    // Check if we can access this URL
    const url = tab.url;
    if (url && (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('moz-extension://'))) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/ramen_48px.png",
        title: "Cannot Open noodle",
        message: "❌ Cannot open noodle on browser internal pages"
      });
      return;
    }
    // Get memory content from external localStorage (shared with memorize extension)
    let memoryContent = '';
    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          return localStorage.getItem('noodle_memory_content') || '';
        }
      });
      memoryContent = result.result || '';
    } catch (error) {
      console.log("Could not access external localStorage:", error);
      memoryContent = '';
    }
    
    // Get selected text if any
    let selectedText = '';
    try {
      const [textResult] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          return window.getSelection().toString();
        }
      });
      selectedText = textResult.result || '';
    } catch (error) {
      console.log("Could not get selected text:", error);
    }

    // Inject the content script to show the modal with memory content and selected text
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: showNoodleModal,
      args: [memoryContent, selectedText]
    });
  } catch (error) {
    console.error("Failed to inject noodle modal:", error);
    chrome.notifications.create({
      type: "basic",
      iconUrl: "assets/icon48.png",
      title: "Error",
      message: "❌ Failed to open noodle modal"
    });
  }
}

// Function to be injected into the page
function showNoodleModal(memoryContent = '', selectedText = '') {
  // Check if ribbon already exists
  if (document.getElementById("noodle-ribbon")) {
    document.getElementById("noodle-ribbon").style.display = "block";
    document.getElementById("noodle-input").focus();
    return;
  }

  // Create ribbon HTML
  const ribbonHTML = `
    <div id="noodle-ribbon" class="noodle-ribbon">
      <div class="noodle-overlay"></div>
      <div class="noodle-ribbon-content">
        <div class="noodle-input-container">
          <span class="noodle-icon">🍜</span>
          <input id="noodle-input" type="text" placeholder="What do you want to noodle?" />
          <button id="noodle-send">
            <span class="send-icon">→</span>
          </button>
        </div>
        <div id="noodle-loading" class="noodle-loading" style="display: none;">
          <div class="spinner"></div>
          <span>Noodling...</span>
        </div>
        <div id="noodle-output" class="noodle-output" style="display: none;"></div>
      </div>
    </div>
  `;

  // Add CSS
  const style = document.createElement('style');
  style.textContent = `
    .noodle-ribbon {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .noodle-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.7);
      z-index: -1;
    }

    .noodle-ribbon-content {
      background-color: #FFFFFF;
      border: 2px solid #C2CFE0;
      border-radius: 8px;
      margin: 12px;
      box-shadow: 0 4px 20px rgba(12, 72, 133, 0.15);
      overflow: hidden;
    }

    .noodle-input-container {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 12px;
      background-color: #FFFFFF;
    }

    .noodle-icon {
      font-size: 20px;
      flex-shrink: 0;
    }

    #noodle-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #C2CFE0;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
      box-sizing: border-box;
      background-color: #FFFFFF;
    }

    #noodle-input:focus {
      border-color: #41A0DC;
      box-shadow: 0 0 0 2px rgba(65, 160, 220, 0.1);
    }

    #noodle-input::placeholder {
      color: #7D9CC0;
    }

    #noodle-send {
      background: linear-gradient(135deg, #41A0DC 0%, #0C4885 100%);
      color: white;
      border: none;
      padding: 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: transform 0.1s, box-shadow 0.2s;
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .send-icon {
      font-size: 16px;
      font-weight: bold;
    }

    #noodle-send:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(65, 160, 220, 0.3);
    }

    #noodle-send:active {
      transform: translateY(0);
    }

    #noodle-send:disabled {
      background: #C2CFE0;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .noodle-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      color: #7D9CC0;
      font-size: 13px;
      background-color: rgba(194, 207, 224, 0.1);
      border-top: 1px solid #C2CFE0;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #C2CFE0;
      border-top: 2px solid #41A0DC;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .noodle-output {
      background-color: #FFFFFF;
      border-top: 1px solid #C2CFE0;
      padding: 20px;
      white-space: pre-wrap;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #0C4885;
      max-height: 400px;
      overflow-y: auto;
      word-wrap: break-word;
      animation: expandDown 0.3s ease-out;
    }

    @keyframes expandDown {
      from {
        opacity: 0;
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
      }
      to {
        opacity: 1;
        max-height: 400px;
        padding-top: 20px;
        padding-bottom: 20px;
      }
    }

    @media (max-width: 600px) {
      .noodle-ribbon-content {
        margin: 8px;
      }
      
      .noodle-input-container {
        padding: 10px 12px;
        gap: 8px;
      }
      
      .noodle-icon {
        font-size: 18px;
      }
      
      #noodle-input {
        padding: 10px 12px;
        font-size: 16px; /* Prevent zoom on iOS */
      }
      
      #noodle-send {
        width: 36px;
        height: 36px;
      }
      
      .send-icon {
        font-size: 14px;
      }
      
      .noodle-loading {
        padding: 12px;
      }
      
      .noodle-output {
        padding: 16px;
        font-size: 13px;
        max-height: 300px;
      }
    }
  `;

  // Add elements to page
  document.head.appendChild(style);
  document.body.insertAdjacentHTML('afterbegin', ribbonHTML);

  // Wire up event handlers
  const ribbon = document.getElementById("noodle-ribbon");
  const sendBtn = document.getElementById("noodle-send");
  const input = document.getElementById("noodle-input");
  const output = document.getElementById("noodle-output");
  const loading = document.getElementById("noodle-loading");
  const overlay = document.querySelector(".noodle-overlay");

  // Close ribbon handlers - click outside to close
  overlay.onclick = () => {
    ribbon.style.animation = "slideUp 0.3s ease-out forwards";
    setTimeout(() => ribbon.remove(), 300);
  };

  // ESC key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && ribbon) {
      ribbon.style.animation = "slideUp 0.3s ease-out forwards";
      setTimeout(() => ribbon.remove(), 300);
    }
  });

  // Add slideUp animation
  const slideUpStyle = document.createElement('style');
  slideUpStyle.textContent = `
    @keyframes slideUp {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(slideUpStyle);

  // Send noodle request
  sendBtn.onclick = async () => {
    const prompt = input.value.trim();
    if (!prompt) return;

    try {
      sendBtn.disabled = true;
      loading.style.display = "flex";
      output.style.display = "none";

      // Memory content and selected text are passed as parameters to this function
      
      // Use API key from configuration
      const apiKey = "insert your api key";
      
      // Limit to most recent 20 memory entries
      let limitedMemoryContent = memoryContent;
      if (memoryContent) {
        const memoryEntries = memoryContent.split('--- Memory Entry').slice(1); // Remove empty first element
        if (memoryEntries.length > 20) {
          // Take the last 20 entries (most recent)
          const recentEntries = memoryEntries.slice(-20);
          limitedMemoryContent = '--- Memory Entry' + recentEntries.join('--- Memory Entry');
        }
      }
      
      // Build system prompt with limited memory and selected text context
      let systemContent = "You are a helpful assistant. The user has provided you with their accumulated memory context below. Use this context to answer their questions. If the memory is empty or doesn't contain relevant information, let them know and answer as best you can.\\n\\nMemory Context:\\n" + limitedMemoryContent;
      
      // Add selected text context if available
      if (selectedText.trim()) {
        systemContent += "\\n\\nSelected Text Context:\\nThe user has selected the following text on the current page. This may be relevant to their question:\\n" + selectedText.trim();
      }
      
      // Prepare messages for OpenAI
      const messages = [
        {
          role: "system",
          content: systemContent
        },
        {
          role: "user", 
          content: prompt
        }
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid OpenAI API key. Please click the extension icon to set up a valid API key.");
        } else if (response.status === 429) {
          throw new Error("OpenAI API rate limit exceeded. Please try again in a moment.");
        } else if (response.status === 500) {
          throw new Error("OpenAI API is experiencing issues. Please try again later.");
        } else {
          throw new Error(`OpenAI API error (${response.status}): ${response.statusText}`);
        }
      }

      const result = await response.json();
      const answer = result.choices?.[0]?.message?.content || "No response received";
      output.textContent = answer;
      output.style.display = "block";
    } catch (error) {
      console.error("Noodle request failed:", error);
      output.textContent = `Error: ${error.message}`;
      output.style.display = "block";
    } finally {
      sendBtn.disabled = false;
      loading.style.display = "none";
    }
  };

  // Handle Enter key
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });

  // Focus input
  input.focus();
}
