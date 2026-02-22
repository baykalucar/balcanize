/**
 * WhatsApp Emoji Reaction Customizer - Content Script
 * This script runs on WhatsApp Web and customizes the reaction emoji picker
 */

(function() {
  'use strict';

  // Default emojis (same as WhatsApp's default)
  const DEFAULT_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  
  // Current custom emojis (loaded from storage)
  let customEmojis = [...DEFAULT_EMOJIS];
  
  // Flag to prevent multiple modifications
  let isProcessing = false;

  /**
   * Load custom emojis from Chrome storage
   */
  function loadCustomEmojis() {
    chrome.storage.sync.get(['customEmojis'], (result) => {
      if (result.customEmojis && Array.isArray(result.customEmojis)) {
        customEmojis = result.customEmojis;
        console.log('[Emoji Customizer] Loaded custom emojis:', customEmojis);
      }
    });
  }

  /**
   * Listen for storage changes (when user updates emojis in popup)
   */
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.customEmojis) {
      customEmojis = changes.customEmojis.newValue || DEFAULT_EMOJIS;
      console.log('[Emoji Customizer] Emojis updated:', customEmojis);
    }
  });

  /**
   * Find the reaction menu in the DOM
   * WhatsApp uses obfuscated class names, so we rely on structure and aria attributes
   */
  function findReactionMenu() {
    // Strategy 1: Look for the reaction bar by its structure
    // The reaction menu typically appears as a floating panel with emoji buttons
    const candidates = document.querySelectorAll('[data-animate-modal-popup="true"]');
    
    for (const candidate of candidates) {
      // Check if it contains emoji buttons (spans with single emoji characters)
      const spans = candidate.querySelectorAll('span[data-emoji]');
      if (spans.length >= 5) {
        return candidate;
      }
    }

    // Strategy 2: Look for emoji spans within a reaction context
    const emojiContainers = document.querySelectorAll('div[role="button"]');
    for (const container of emojiContainers) {
      const parent = container.closest('[data-animate-modal-popup="true"]');
      if (parent) {
        const emojiSpans = parent.querySelectorAll('span[data-emoji]');
        if (emojiSpans.length >= 5) {
          return parent;
        }
      }
    }

    // Strategy 3: Find by the characteristic structure of reaction picker
    const allDivs = document.querySelectorAll('div');
    for (const div of allDivs) {
      // Look for a container that has multiple emoji spans as direct/near descendants
      const emojiSpans = div.querySelectorAll(':scope > div span[data-emoji], :scope > span[data-emoji]');
      if (emojiSpans.length >= 5 && emojiSpans.length <= 10) {
        // Check if this looks like a reaction menu (horizontal layout, small size)
        const rect = div.getBoundingClientRect();
        if (rect.width > 100 && rect.width < 500 && rect.height < 150) {
          return div;
        }
      }
    }

    return null;
  }

  /**
   * Find the emoji button container within the reaction menu
   */
  function findEmojiButtonContainer(reactionMenu) {
    // Look for the container holding the emoji buttons
    const containers = reactionMenu.querySelectorAll('div');
    
    for (const container of containers) {
      const directEmojiSpans = container.querySelectorAll(':scope > div[role="button"] span[data-emoji]');
      if (directEmojiSpans.length >= 5) {
        return container;
      }
    }

    // Fallback: find parent of emoji spans
    const firstEmoji = reactionMenu.querySelector('span[data-emoji]');
    if (firstEmoji) {
      let parent = firstEmoji.parentElement;
      while (parent && parent !== reactionMenu) {
        const siblings = parent.parentElement?.children;
        if (siblings && siblings.length >= 5) {
          return parent.parentElement;
        }
        parent = parent.parentElement;
      }
    }

    return null;
  }

  /**
   * Create a custom emoji button that mimics WhatsApp's style
   */
  function createEmojiButton(emoji, template) {
    const button = template.cloneNode(true);
    
    // Find the emoji span and update it
    const emojiSpan = button.querySelector('span[data-emoji]');
    if (emojiSpan) {
      emojiSpan.textContent = emoji;
      emojiSpan.setAttribute('data-emoji', emoji);
    } else {
      // If no span found, try to find any text node with emoji
      const spans = button.querySelectorAll('span');
      for (const span of spans) {
        if (span.textContent && /\p{Emoji}/u.test(span.textContent)) {
          span.textContent = emoji;
          if (span.hasAttribute('data-emoji')) {
            span.setAttribute('data-emoji', emoji);
          }
          break;
        }
      }
    }

    // Update aria-label if present
    const ariaElements = button.querySelectorAll('[aria-label]');
    ariaElements.forEach(el => {
      const label = el.getAttribute('aria-label');
      if (label && /\p{Emoji}/u.test(label)) {
        el.setAttribute('aria-label', emoji);
      }
    });

    return button;
  }

  /**
   * Modify the reaction menu to show custom emojis
   */
  function modifyReactionMenu(reactionMenu) {
    if (isProcessing) return;
    isProcessing = true;

    try {
      // Find all existing emoji buttons
      const emojiButtons = reactionMenu.querySelectorAll('div[role="button"]');
      const emojiButtonsArray = Array.from(emojiButtons).filter(btn => {
        const emojiSpan = btn.querySelector('span[data-emoji]');
        return emojiSpan !== null;
      });

      if (emojiButtonsArray.length === 0) {
        console.log('[Emoji Customizer] No emoji buttons found');
        isProcessing = false;
        return;
      }

      // Get the container of emoji buttons
      const container = emojiButtonsArray[0].parentElement;
      if (!container) {
        isProcessing = false;
        return;
      }

      // Use the first button as a template
      const template = emojiButtonsArray[0];

      // Store the "more" button if it exists (usually the last one with a + icon)
      let moreButton = null;
      const lastButton = emojiButtonsArray[emojiButtonsArray.length - 1];
      const lastButtonText = lastButton.textContent;
      if (lastButtonText.includes('+') || lastButtonText.includes('➕')) {
        moreButton = lastButton.cloneNode(true);
      }

      // Clear existing emoji buttons (keep non-emoji children)
      const nonEmojiChildren = [];
      for (const child of container.children) {
        const hasEmoji = child.querySelector('span[data-emoji]');
        if (!hasEmoji) {
          nonEmojiChildren.push(child);
        }
      }

      // Remove all emoji buttons
      emojiButtonsArray.forEach(btn => btn.remove());

      // Add custom emoji buttons
      customEmojis.forEach((emoji, index) => {
        const newButton = createEmojiButton(emoji, template);
        
        // Add click handler to send the reaction
        newButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Trigger WhatsApp's reaction mechanism
          simulateReaction(emoji, reactionMenu);
        });

        container.appendChild(newButton);
      });

      // Add more button back if it existed
      if (moreButton) {
        container.appendChild(moreButton);
      }

      // Add custom styling for scrolling if many emojis
      if (customEmojis.length > 6) {
        container.style.maxWidth = '320px';
        container.style.overflowX = 'auto';
        container.style.flexWrap = 'nowrap';
        container.classList.add('emoji-customizer-scroll');
      }

      // Mark as processed
      reactionMenu.setAttribute('data-emoji-customized', 'true');
      
      console.log('[Emoji Customizer] Reaction menu customized with', customEmojis.length, 'emojis');
    } catch (error) {
      console.error('[Emoji Customizer] Error modifying reaction menu:', error);
    } finally {
      isProcessing = false;
    }
  }

  /**
   * Simulate clicking on an emoji reaction
   * This tries to trigger WhatsApp's native reaction handling
   */
  function simulateReaction(emoji, reactionMenu) {
    // Find the original emoji button mechanism
    // WhatsApp typically handles this through event listeners on the buttons
    
    // Try to find and click the "more" button to open full emoji picker
    // Then we can search for and click the desired emoji
    const moreButton = reactionMenu.querySelector('div[role="button"]:last-child');
    
    // For now, we'll rely on WhatsApp's event handling
    // The cloned buttons should inherit the click behavior
    console.log('[Emoji Customizer] Reaction selected:', emoji);
  }

  /**
   * Observe DOM changes to detect when reaction menu appears
   */
  function setupObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if any added node is or contains a reaction menu
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if this node is a reaction menu
              const emojiSpans = node.querySelectorAll?.('span[data-emoji]');
              if (emojiSpans && emojiSpans.length >= 5) {
                // Check if not already processed
                if (!node.hasAttribute('data-emoji-customized')) {
                  setTimeout(() => modifyReactionMenu(node), 50);
                }
              }

              // Also check for popup modals that might contain reaction menus
              if (node.hasAttribute?.('data-animate-modal-popup')) {
                setTimeout(() => {
                  const menu = findReactionMenu();
                  if (menu && !menu.hasAttribute('data-emoji-customized')) {
                    modifyReactionMenu(menu);
                  }
                }, 100);
              }
            }
          });
        }
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('[Emoji Customizer] Observer started');
    return observer;
  }

  /**
   * Alternative: Use event delegation to catch reaction menu interactions
   */
  function setupEventListeners() {
    document.addEventListener('mouseover', (e) => {
      // Check if hovering over a message (which might trigger reaction UI)
      const messageContainer = e.target.closest('[data-id]');
      if (messageContainer) {
        // Schedule a check for reaction menu
        setTimeout(() => {
          const menu = findReactionMenu();
          if (menu && !menu.hasAttribute('data-emoji-customized')) {
            modifyReactionMenu(menu);
          }
        }, 200);
      }
    }, { passive: true });

    // Also handle double-click on messages (another way to react)
    document.addEventListener('dblclick', (e) => {
      setTimeout(() => {
        const menu = findReactionMenu();
        if (menu && !menu.hasAttribute('data-emoji-customized')) {
          modifyReactionMenu(menu);
        }
      }, 200);
    }, { passive: true });
  }

  /**
   * Initialize the extension
   */
  function init() {
    console.log('[Emoji Customizer] Initializing...');
    
    // Load custom emojis from storage
    loadCustomEmojis();
    
    // Wait for WhatsApp Web to fully load
    const checkReady = setInterval(() => {
      const app = document.querySelector('#app');
      const mainContent = document.querySelector('[data-asset-chat-background]') || 
                          document.querySelector('[data-testid="conversation-panel-wrapper"]') ||
                          document.querySelector('div[tabindex="-1"]');
      
      if (app && mainContent) {
        clearInterval(checkReady);
        console.log('[Emoji Customizer] WhatsApp Web loaded, starting observer');
        
        // Setup mutation observer
        setupObserver();
        
        // Setup event listeners as backup
        setupEventListeners();
      }
    }, 1000);

    // Timeout after 30 seconds
    setTimeout(() => clearInterval(checkReady), 30000);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
