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
  function createEmojiOverlay(imgElement, emoji) {
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
    log('Created overlay for', emoji);
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
          createEmojiOverlay(img, newEmoji);
          button.setAttribute('data-balcanize-emoji', newEmoji);
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
