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
   * Replaces the button entirely to remove WhatsApp's event handlers
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
    
    // Clone button to remove all WhatsApp event listeners
    if (!button.hasAttribute('data-balcanize-intercepted')) {
      const buttonParent = button.parentElement;
      if (!buttonParent) return;
      
      // Clone the button (this removes all event listeners)
      const newButton = button.cloneNode(true);
      newButton.setAttribute('data-balcanize-intercepted', 'true');
      newButton.setAttribute('data-balcanize-emoji', emoji);
      
      // Add our own click handler
      newButton.addEventListener('click', (e) => {
        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();
        
        if (isSendingReaction) {
          log('Clone button: already sending, ignoring');
          return;
        }
        
        const targetEmoji = newButton.getAttribute('data-balcanize-emoji');
        log('Clone button clicked! Sending emoji:', targetEmoji);
        sendCustomReaction(targetEmoji);
      }, true);
      
      // Block all pointer events too
      ['pointerdown', 'pointerup', 'mousedown', 'mouseup'].forEach(eventType => {
        newButton.addEventListener(eventType, (e) => {
          if (!isSendingReaction) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
          }
        }, true);
      });
      
      // Replace original button with clone
      buttonParent.replaceChild(newButton, button);
      log('Replaced button with clone for', emoji);
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
        
        // FIRST scroll the emoji into view
        img.scrollIntoView({ block: 'center', behavior: 'instant' });
        await sleep(100);
        
        // NOW get the visual center of the image (after scroll)
        const rect = img.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        log('Emoji position after scroll:', centerX, centerY);
        
        // Check if position is valid (on screen)
        if (centerY < 0 || centerY > window.innerHeight || centerX < 0 || centerX > window.innerWidth) {
          log('Emoji still off-screen, trying direct click');
          simulateClick(img);
          return true;
        }
        
        // Find what element is actually at this position
        const elementAtPoint = document.elementFromPoint(centerX, centerY);
        log('Element at point:', elementAtPoint?.tagName, elementAtPoint?.className);
        
        // Try clicking the element at point
        if (elementAtPoint) {
          // Try focus + Enter key approach
          elementAtPoint.focus();
          elementAtPoint.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          elementAtPoint.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));
          
          await sleep(50);
          
          // Also try simulated click
          simulateClick(elementAtPoint);
          
          // Try clicking via coordinates using elementFromPoint again
          await sleep(50);
          const newRect = elementAtPoint.getBoundingClientRect();
          const newX = newRect.left + newRect.width / 2;
          const newY = newRect.top + newRect.height / 2;
          
          const finalTarget = document.elementFromPoint(newX, newY);
          if (finalTarget && finalTarget !== elementAtPoint) {
            log('Clicking final target:', finalTarget.tagName);
            simulateClick(finalTarget);
          }
        }
        
        // Also try img directly
        simulateClick(img);
        
        return true;
      }
    }
    
    // Also try looking for span elements with the emoji
    const allSpans = document.querySelectorAll('span[data-testid], span');
    for (const span of allSpans) {
      // SKIP our own overlay elements
      if (span.classList.contains('balcanize-overlay')) {
        continue;
      }
      // SKIP elements inside our modified buttons
      if (span.closest('[data-balcanize-intercepted]')) {
        continue;
      }
      // SKIP elements inside textbox/search input
      if (span.closest('[role="textbox"]') || span.closest('[contenteditable="true"]')) {
        continue;
      }
      
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
        
        if (button && button.tagName !== 'P' && !button.hasAttribute('data-balcanize-intercepted')) {
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
    
    // IMPORTANT: Find search input INSIDE the emoji picker dialog, not the main chat search
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) {
      log('No dialog found');
      return false;
    }
    
    log('Found dialog, looking for search input inside...');
    
    // Find search input inside the dialog
    const searchInput = dialog.querySelector('div[contenteditable="true"][data-tab]') ||
                        dialog.querySelector('div[contenteditable="true"]') ||
                        dialog.querySelector('input[placeholder*="Search"], input[placeholder*="Ara"], input[type="text"]');
    
    if (searchInput) {
      log('Found search input in dialog:', searchInput.tagName);
      
      // Focus and type the emoji
      searchInput.focus();
      
      // Clear any existing content first
      if (searchInput.contentEditable === 'true') {
        searchInput.innerHTML = '';
      }
      
      // Type the emoji using execCommand for better compatibility
      document.execCommand('insertText', false, emoji);
      searchInput.dispatchEvent(new InputEvent('input', { bubbles: true, data: emoji }));
      
      // Wait for search results to appear
      await sleep(1000);
      
      // Try keyboard navigation - Tab to move to results, Enter to select
      log('Trying keyboard navigation...');
      
      // Press Tab to move focus to results
      searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', keyCode: 9, bubbles: true }));
      await sleep(100);
      
      // Press Enter to select
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      await sleep(100);
      
      // Also try ArrowDown + Enter approach
      searchInput.focus();
      searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true }));
      await sleep(100);
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
      
      await sleep(200);
      
      // Check if picker is still open - if not, we succeeded
      const pickerStillOpen = document.querySelector('[role="dialog"]');
      if (!pickerStillOpen) {
        log('Picker closed - reaction probably sent!');
        return true;
      }
      
      // Last resort: try to find and click the first emoji result that's NOT in the search box
      log('Keyboard navigation may have failed, trying direct click...');
      
      const emojisInDialog = dialog.querySelectorAll('img.emoji, img[alt]');
      for (const img of emojisInDialog) {
        // Skip if in search input area
        if (img.closest('[role="textbox"]') || img.closest('[contenteditable]')) {
          continue;
        }
        if (img.alt === emoji) {
          log('Found emoji in dialog:', img.alt);
          img.scrollIntoView({ block: 'center' });
          await sleep(50);
          simulateClick(img);
          return true;
        }
      }
      
    } else {
      log('No search input found in dialog');
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
