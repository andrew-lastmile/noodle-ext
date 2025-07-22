// Memorize Chrome Extension Background Script

// Create context menu items on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "addToMemory",
      title: "memorize",
      contexts: ["page", "selection", "image", "link"]
    });
    
    chrome.contextMenus.create({
      id: "downloadMemory",
      title: "Download Memory File",
      contexts: ["action"]
    });
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "addToMemory") {
    await handleAddToMemory(info, tab);
  } else if (info.menuItemId === "downloadMemory") {
    await handleDownloadMemory();
  }
});

// Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  await handleDownloadMemory();
});

// Handle "Add to Memory" action
async function handleAddToMemory(info, tab) {
  try {
    // Check if we can access this URL
    const url = info.pageUrl || info.linkUrl || tab.url;
    if (url && (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('moz-extension://'))) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/soup_pot_48px.png",
        title: "Cannot Memorize",
        message: "❌ Cannot memorize browser internal pages"
      });
      return;
    }

    // Get page title and content
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        // Extract clean text content from the page
        function extractCleanContent() {
          // Create a copy of the document to avoid modifying the original
          const docClone = document.cloneNode(true);
          
          // Remove script and style elements from the COPY only
          const scripts = docClone.querySelectorAll('script, style, noscript');
          scripts.forEach(el => el.remove());
          
          // Try to get main content areas first
          const mainSelectors = [
            'main',
            'article', 
            '[role="main"]',
            '.main-content',
            '#main-content',
            '.content',
            '#content',
            '.post-content',
            '.entry-content'
          ];
          
          let mainContent = null;
          for (const selector of mainSelectors) {
            mainContent = docClone.querySelector(selector);
            if (mainContent) break;
          }
          
          // If no main content found, use body but exclude common non-content elements
          if (!mainContent) {
            mainContent = docClone.body;
          }
          
          if (mainContent) {
            // Remove common non-content elements
            const elementsToRemove = mainContent.querySelectorAll(
              'nav, header, footer, aside, .nav, .navbar, .sidebar, .menu, ' +
              '.advertisement, .ads, .social-share, .comments, .related-posts, ' +
              '.popup, .modal, .overlay, .cookie-notice, .newsletter-signup'
            );
            elementsToRemove.forEach(el => el.remove());
            
            // Get text content and clean it up
            let text = mainContent.innerText || mainContent.textContent || '';
            
            // Clean up whitespace
            text = text.replace(/\s+/g, ' ').trim();
            
            // Limit length to prevent huge captures
            if (text.length > 5000) {
              text = text.substring(0, 5000) + '... [content truncated]';
            }
            
            return text;
          }
          
          return '';
        }
        
        return {
          title: document.title,
          cleanContent: extractCleanContent()
        };
      }
    });
    
    const timestamp = new Date().toISOString();
    const title = result.result?.title || "Untitled";
    const selectedText = info.selectionText || "";
    const pageContent = result.result?.cleanContent || "";
    const type = selectedText ? "selection" : info.linkUrl ? "link" : "page";
    
    // Format the memory entry
    let memoryEntry = `--- Memory Entry [${timestamp}] ---\n`;
    memoryEntry += `Type: ${type}\n`;
    memoryEntry += `URL: ${url}\n`;
    memoryEntry += `Title: ${title}\n`;
    
    if (selectedText) {
      memoryEntry += `Selected Text: ${selectedText}\n`;
    } else if (type === "page" && pageContent) {
      memoryEntry += `Page Content: ${pageContent}\n`;
    }
    
    memoryEntry += `\n`;
    
    // Get existing memory from storage
    const result_storage = await chrome.storage.local.get(['memoryContent']);
    const existingContent = result_storage.memoryContent || '';
    
    // Append new entry
    const updatedContent = existingContent + memoryEntry;
    
    // Save updated content back to storage
    await chrome.storage.local.set({ memoryContent: updatedContent });
    
    // Also save to external storage accessible by other extensions
    if (!url || (!url.startsWith('chrome://') && !url.startsWith('chrome-extension://') && !url.startsWith('moz-extension://'))) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: (content) => {
            localStorage.setItem('noodle_memory_content', content);
          },
          args: [updatedContent]
        });
      } catch (error) {
        console.log("Could not save to external storage:", error);
      }
    }
    
    // Get memory count for display
    const entries = updatedContent.split('--- Memory Entry').length - 1;
    
    // Show success notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "assets/soup_pot_48px.png",
      title: "memorized",
      message: `✔️ memorized! (${entries} entries)`
    });
    
    // Show toast notification
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (message, type) => {
        // Remove existing toast
        const existingToast = document.getElementById('memory-toast');
        if (existingToast) {
          existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.id = 'memory-toast';
        toast.textContent = message;
        
        // Apply styles
        Object.assign(toast.style, {
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 20px',
          borderRadius: '6px',
          color: 'white',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: '10001',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          transform: 'translateX(100%)',
          opacity: '0',
          backgroundColor: '#41A0DC'
        });

        // Add to page
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
          toast.style.transform = 'translateX(0)';
          toast.style.opacity = '1';
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
          toast.style.transform = 'translateX(100%)';
          toast.style.opacity = '0';
          setTimeout(() => {
            if (toast.parentNode) {
              toast.remove();
            }
          }, 300);
        }, 3000);
      },
      args: [`memorized! (${entries} entries)`, "success"]
    });
    
  } catch (error) {
    console.error("Failed to memorize:", error);
    chrome.notifications.create({
      type: "basic",
      iconUrl: "assets/soup_pot_48px.png",
      title: "Error",
      message: "❌ Failed to memorize"
    });
  }
}

// Handle "Download Memory" action
async function handleDownloadMemory() {
  try {
    console.log("Download memory function called");
    const result = await chrome.storage.local.get(['memoryContent']);
    const memoryContent = result.memoryContent || '';
    console.log("Memory content retrieved:", memoryContent.length, "characters");
    
    if (!memoryContent.trim()) {
      console.log("No memory content found");
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/soup_pot_48px.png",
        title: "Empty Memory",
        message: "No memory entries to download"
      });
      return;
    }
    
    // Create file with header
    const fileContent = `# Memory File\nGenerated: ${new Date().toISOString()}\n\n${memoryContent}`;
    console.log("File content prepared, length:", fileContent.length);
    
    // Create filename with current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `memory-${dateStr}.txt`;
    console.log("Filename:", filename);
    
    // Convert to data URL for download
    const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent);
    
    const downloadId = await chrome.downloads.download({
      url: dataUrl,
      filename: filename,
      saveAs: true
    });
    console.log("Download initiated with ID:", downloadId);
    
    const entries = memoryContent.split('--- Memory Entry').length - 1;
    chrome.notifications.create({
      type: "basic",
      iconUrl: "assets/soup_pot_48px.png",
      title: "Memory Downloaded",
      message: `📄 Downloaded ${entries} memory entries`
    });
    
  } catch (error) {
    console.error("Failed to download memory:", error);
    chrome.notifications.create({
      type: "basic",
      iconUrl: "assets/soup_pot_48px.png",
      title: "Error",
      message: `❌ Failed to download memory: ${error.message}`
    });
  }
}