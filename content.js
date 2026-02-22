/**
 * Balcanize - WhatsApp Emoji Reaction Customizer
 * Content Script - Customizes reaction emoji picker on WhatsApp Web
 */

(function() {
  'use strict';

  const DEBUG = true;
  const log = (...args) => DEBUG && console.log('[Balcanize]', ...args);
  const warn = (...args) => console.warn('[Balcanize]', ...args);

  // Default WhatsApp reaction emojis
  const DEFAULT_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  
  // User's custom emojis
  let customEmojis = [...DEFAULT_EMOJIS];
  
  // Processing flag
  let isProcessing = false;
  
  // Flag to prevent recursive click interception
  let isSendingReaction = false;

  /**
   * Load custom emojis from Chrome storage
   */
  function loadCustomEmojis() {
    chrome.storage.sync.get(['customEmojis'], (result) => {
      if (result.customEmojis && Array.isArray(result.customEmojis)) {
        customEmojis = result.customEmojis;
        log('Loaded custom emojis:', customEmojis);
      } else {
        log('No custom emojis found, using defaults');
      }
    });
  }

  /**
   * Listen for storage changes
   */
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.customEmojis) {
      customEmojis = changes.customEmojis.newValue || DEFAULT_EMOJIS;
      log('Emojis updated:', customEmojis);
    }
  });

  /**
   * Create an emoji overlay on top of the WhatsApp sprite image
   */
  function createEmojiOverlay(imgElement, emoji, button) {
    // Hide the original sprite
    imgElement.style.opacity = '0';
    
    // Get parent and create overlay
    const parent = imgElement.parentElement;
    if (!parent) return;
    
    // Check if overlay already exists
    let overlay = parent.querySelector('.balcanize-overlay');
    if (!overlay) {
      overlay = document.createElement('span');
      overlay.className = 'balcanize-overlay';
      overlay.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 32px; font-family: Apple Color Emoji, Segoe UI Emoji, sans-serif; line-height: 1; z-index: 10; pointer-events: none;';
      parent.style.position = 'relative';
      parent.appendChild(overlay);
    }
    
    overlay.textContent = emoji;
    
    // Add click interceptor to the button
    if (!button.hasAttribute('data-balcanize-intercepted')) {
      button.setAttribute('data-balcanize-intercepted', 'true');
      
      // Handler function for all event types
      const interceptHandler = (e) => {
        // Check FIRST if we're already sending - if so, let the click through completely
        if (isSendingReaction) {
          log('Skipping intercept - already sending reaction, letting click through');
          return; // Don't block anything, let WhatsApp handle it
        }
        
        const targetEmoji = button.getAttribute('data-balcanize-emoji');
        if (targetEmoji) {
          // Only NOW block the event, after we know we want to intercept
          e.stopImmediatePropagation();
          e.stopPropagation();
          e.preventDefault();
          
          // Only trigger reaction on pointerup or click (not on pointerdown)
          if (e.type === 'pointerup' || e.type === 'click' || e.type === 'mouseup') {
            log('Intercepted', e.type, '- sending emoji:', targetEmoji);
            sendCustomReaction(targetEmoji);
          } else {
            log('Blocked', e.type, 'event');
          }
        }
      };
      
      // Intercept ALL relevant events in capture phase
      button.addEventListener('pointerdown', interceptHandler, true);
      button.addEventListener('pointerup', interceptHandler, true);
      button.addEventListener('mousedown', interceptHandler, true);
      button.addEventListener('mouseup', interceptHandler, true);
      button.addEventListener('click', interceptHandler, true);
    }
    
    log('Created overlay for', emoji);
  }

  /**
   * Send custom reaction by opening emoji picker and selecting the emoji
   */
  async function sendCustomReaction(emoji) {
    log('Sending custom reaction:', emoji);
    
    // Set flag to prevent recursive interception
    isSendingReaction = true;
    
    try {
      // Find the "+" (more reactions) button
      let moreButton = document.querySelector('div[role="button"][aria-label="Diğer ifadeler"]') ||
                       document.querySelector('div[role="button"][aria-label="More reactions"]') ||
                       document.querySelector('div[role="button"][aria-label="All reactions"]');
      
      if (!moreButton) {
        log('More button not found, trying to find by content...');
        // Try to find by the plus icon
        const allButtons = document.querySelectorAll('div[role="button"]');
        for (const btn of allButtons) {
          if (btn.textContent.includes('+') || btn.textContent.includes('plus')) {
            moreButton = btn;
            break;
          }
        }
      }
      
      if (moreButton) {
        log('Found more button, clicking...');
        moreButton.click();
        
        // Wait for emoji picker to open
        await sleep(300);
        
        // Find the emoji in the picker
        const found = await findAndClickEmoji(emoji);
        if (!found) {
          log('Could not find emoji in picker, searching...');
          await searchAndClickEmoji(emoji);
        }
      } else {
        warn('Could not find more reactions button');
      }
    } finally {
      // Reset flag
      isSendingReaction = false;
      log('Reaction sending complete');
    }
  }

  /**
   * Sleep helper
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Simulate realistic click on element
   */
  function simulateClick(element) {
    log('Simulating click on:', element.tagName, element.className);
    
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const eventOptions = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: centerX,
      clientY: centerY,
      screenX: centerX,
      screenY: centerY,
      button: 0,
      buttons: 1,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true
    };
    
    // Pointer events (React often uses these)
    element.dispatchEvent(new PointerEvent('pointerdown', eventOptions));
    element.dispatchEvent(new PointerEvent('pointerup', eventOptions));
    
    // Mouse events
    element.dispatchEvent(new MouseEvent('mousedown', eventOptions));
    element.dispatchEvent(new MouseEvent('mouseup', eventOptions));
    element.dispatchEvent(new MouseEvent('click', eventOptions));
    
    // Also try native click
    element.click();
    
    log('Click events dispatched');
  }

  /**
   * Find and click emoji in the open picker
   */
  async function findAndClickEmoji(emoji) {
    log('Searching for emoji in picker:', emoji);
    
    // WhatsApp uses img.emojik for emojis in picker too
    const allEmojiImgs = document.querySelectorAll('img.emojik, img.emoji, img[alt]');
    log('Found', allEmojiImgs.length, 'emoji images in picker');
    
    for (const img of allEmojiImgs) {
      // Check alt attribute - WhatsApp stores emoji character in alt
      if (img.alt === emoji || img.getAttribute('data-plain-text') === emoji) {
        log('Found emoji image with alt:', img.alt);
        
        // Log parent hierarchy for debugging
        let el = img;
        let hierarchy = [];
        for (let i = 0; i < 8 && el; i++) {
          const role = el.getAttribute && el.getAttribute('role');
          hierarchy.push(el.tagName + (role ? `[role=${role}]` : ''));
          el = el.parentElement;
        }
        log('IMG hierarchy:', hierarchy.join(' -> '));
        
        // Try clicking up the tree to find a clickable ancestor
        let clickTarget = img;
        let current = img.parentElement;
        while (current && current.tagName !== 'BODY') {
          const role = current.getAttribute('role');
          if (role === 'button' || role === 'gridcell' || role === 'listitem' || role === 'option') {
            clickTarget = current;
            break;
          }
          // Check for data-testid as potential click target
          if (current.hasAttribute('data-testid')) {
            clickTarget = current;
          }
          current = current.parentElement;
        }
        
        log('Click target:', clickTarget.tagName, clickTarget.className);
        simulateClick(clickTarget);
        
        // Also try img directly after a small delay
        await sleep(50);
        simulateClick(img);
        
        return true;
      }
    }
    
    // Also try looking for span elements with the emoji
    const allSpans = document.querySelectorAll('span[data-testid], span');
    for (const span of allSpans) {
      if (span.textContent === emoji || span.textContent.trim() === emoji) {
        // Log the parent hierarchy for debugging
        let el = span;
        let hierarchy = [];
        for (let i = 0; i < 6 && el; i++) {
          hierarchy.push(el.tagName + (el.role ? `[role=${el.role}]` : '') + (el.getAttribute('role') ? `[role=${el.getAttribute('role')}]` : ''));
          el = el.parentElement;
        }
        log('Element hierarchy:', hierarchy.join(' -> '));
        
        // Try to find the correct clickable element
        // WhatsApp emoji picker uses different structures
        const button = span.closest('[role="gridcell"]') || 
                       span.closest('[role="listitem"]') || 
                       span.closest('[role="option"]') ||
                       span.closest('div[role="button"]') || 
                       span.closest('button') ||
                       span.closest('[data-testid]');
        
        if (button && button.tagName !== 'P') {
          log('Found emoji span, clicking wrapper:', button.tagName);
          simulateClick(button);
          return true;
        }
        
        // If no good wrapper found, try clicking the span directly
        log('No good wrapper, clicking span directly');
        simulateClick(span);
        return true;
      }
    }
    
    // Log what we found for debugging
    const sampleAlts = Array.from(allEmojiImgs).slice(0, 10).map(img => img.alt);
    log('Sample alts found:', sampleAlts.join(', '));
    
    return false;
  }

  /**
   * Search for emoji if not immediately visible
   */
  async function searchAndClickEmoji(emoji) {
    log('Trying search method for:', emoji);
    
    // Find search input in emoji picker - WhatsApp uses div with contenteditable
    const searchInput = document.querySelector('div[contenteditable="true"][data-tab]') ||
                        document.querySelector('div[contenteditable="true"]') ||
                        document.querySelector('input[placeholder*="Search"], input[placeholder*="Ara"], input[type="text"]');
    
    if (searchInput) {
      log('Found search input:', searchInput.tagName);
      
      // Focus and type the emoji
      searchInput.focus();
      
      // For contenteditable divs
      if (searchInput.contentEditable === 'true') {
        searchInput.textContent = emoji;
        searchInput.dispatchEvent(new InputEvent('input', { bubbles: true, data: emoji }));
      } else {
        searchInput.value = emoji;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      // Wait for search results
      await sleep(500);
      
      // Try to find and click the emoji now
      const found = await findAndClickEmoji(emoji);
      if (found) return true;
      
      // Try clicking any emoji button that appears
      const emojiButtons = document.querySelectorAll('img.emojik[alt], div[role="button"] img[alt]');
      log('Found', emojiButtons.length, 'emoji buttons after search');
      for (const img of emojiButtons) {
        if (img.alt === emoji) {
          log('Found matching emoji after search:', img.alt);
          const btn = img.closest('div[role="button"]');
          if (btn) {
            simulateClick(btn);
          } else {
            simulateClick(img);
          }
          return true;
        }
      }
    } else {
      log('No search input found');
    }
    
    return false;
  }

  /**
   * Modify reaction buttons
   */
  function modifyReactionButtons() {
    const allButtons = document.querySelectorAll('div[role="button"]');
    const reactionButtons = Array.from(allButtons).filter(btn => {
      const img = btn.querySelector('img.emojik');
      return img !== null;
    });

    if (reactionButtons.length < 6) {
      return false;
    }

    // Check if already modified
    if (reactionButtons[0].querySelector('.balcanize-overlay')) {
      return true;
    }

    log('Found', reactionButtons.length, 'reaction buttons, modifying...');

    reactionButtons.slice(0, 6).forEach((button, index) => {
      if (index < customEmojis.length) {
        const img = button.querySelector('img.emojik');
        if (img) {
          const newEmoji = customEmojis[index];
          log('Button', index, ':', img.alt, '->', newEmoji);
          button.setAttribute('data-balcanize-emoji', newEmoji);
          createEmojiOverlay(img, newEmoji, button);
        }
      }
    });

    log('Modification complete!');
    return true;
  }

  /**
   * Setup mutation observer
   */
  function setupObserver() {
    log('Setting up observer...');

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.querySelector && node.querySelector('img.emojik')) {
                setTimeout(modifyReactionButtons, 50);
                return;
              }
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    log('Observer started');
  }

  /**
   * Setup periodic check
   */
  function setupPeriodicCheck() {
    setInterval(() => {
      const imgs = document.querySelectorAll('img.emojik');
      if (imgs.length >= 6) {
        const parent = imgs[0].parentElement;
        if (parent && !parent.querySelector('.balcanize-overlay')) {
          modifyReactionButtons();
        }
      }
    }, 300);
  }

  /**
   * Initialize
   */
  function init() {
    log('=== Balcanize Starting ===');
    loadCustomEmojis();

    const checkReady = setInterval(() => {
      const app = document.querySelector('#app');
      if (app) {
        clearInterval(checkReady);
        log('WhatsApp ready!');
        setupObserver();
        setupPeriodicCheck();
      }
    }, 500);

    setTimeout(() => {
      clearInterval(checkReady);
      setupObserver();
      setupPeriodicCheck();
    }, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.balcanizeDebug = {
    emojis: () => customEmojis,
    modify: modifyReactionButtons,
    imgs: () => document.querySelectorAll('img.emojik'),
    reset: () => {
      document.querySelectorAll('.balcanize-overlay').forEach(el => el.remove());
      document.querySelectorAll('img.emojik').forEach(img => img.style.opacity = '1');
    }
  };
})();
