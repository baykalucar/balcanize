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

  // Emoji to search name mapping (for WhatsApp's text-based emoji search)
  const EMOJI_NAMES = {
    '😀': 'grinning', '😃': 'smiley', '😄': 'smile', '😁': 'grin', '😆': 'laughing',
    '😅': 'sweat smile', '🤣': 'rofl', '😂': 'joy', '🙂': 'slightly smiling',
    '🙃': 'upside down', '🫠': 'melting', '😉': 'wink', '😊': 'blush',
    '😇': 'innocent', '🥰': 'smiling hearts', '😍': 'heart eyes', '🤩': 'star struck',
    '😘': 'kissing heart', '😗': 'kissing', '☺️': 'relaxed', '😚': 'kissing closed',
    '😙': 'kissing smiling', '🥲': 'smiling tear', '😋': 'yum', '😛': 'stuck out tongue',
    '😜': 'stuck out tongue wink', '🤪': 'zany', '😝': 'stuck out tongue closed',
    '🤑': 'money mouth', '🤗': 'hugs', '🤭': 'hand over mouth', '🫢': 'face with open eyes',
    '🫣': 'peeking', '🤫': 'shushing', '🤔': 'thinking', '🫡': 'saluting',
    '🤐': 'zipper mouth', '🤨': 'raised eyebrow', '😐': 'neutral', '😑': 'expressionless',
    '😶': 'no mouth', '🫥': 'dotted line', '😏': 'smirk', '😒': 'unamused',
    '🙄': 'rolling eyes', '😬': 'grimacing', '😮‍💨': 'exhaling', '🤥': 'lying',
    '🫨': 'shaking', '😌': 'relieved', '😔': 'pensive', '😪': 'sleepy',
    '🤤': 'drooling', '😴': 'sleeping', '😷': 'mask', '🤒': 'thermometer',
    '🤕': 'bandage head', '🤢': 'nauseated', '🤮': 'vomiting', '🤧': 'sneezing',
    '🥵': 'hot', '🥶': 'cold', '🥴': 'woozy', '😵': 'dizzy', '😵‍💫': 'face spiral',
    '🤯': 'exploding head', '🤠': 'cowboy', '🥳': 'partying', '🥸': 'disguised',
    '😎': 'sunglasses', '🤓': 'nerd', '🧐': 'monocle', '😕': 'confused',
    '🫤': 'diagonal mouth', '😟': 'worried', '🙁': 'slightly frowning', '☹️': 'frowning',
    '😮': 'open mouth', '😯': 'hushed', '😲': 'astonished', '😳': 'flushed',
    '🥺': 'pleading', '🥹': 'holding back tears', '😦': 'frowning open mouth',
    '😧': 'anguished', '😨': 'fearful', '😰': 'anxious sweat', '😥': 'sad relieved',
    '😢': 'cry', '😭': 'sob', '😱': 'scream', '😖': 'confounded', '😣': 'persevere',
    '😞': 'disappointed', '😓': 'downcast sweat', '😩': 'weary', '😫': 'tired',
    '🥱': 'yawning', '😤': 'triumph', '😡': 'rage', '😠': 'angry', '🤬': 'cursing',
    '😈': 'smiling imp', '👿': 'imp', '💀': 'skull', '☠️': 'skull crossbones',
    '💩': 'poop', '🤡': 'clown', '👹': 'ogre', '👺': 'goblin', '👻': 'ghost',
    '👽': 'alien', '👾': 'space invader', '🤖': 'robot', '😺': 'smiley cat',
    '😸': 'smile cat', '😹': 'joy cat', '😻': 'heart eyes cat', '😼': 'smirk cat',
    '😽': 'kissing cat', '🙀': 'weary cat', '😿': 'crying cat', '😾': 'pouting cat',
    '🙈': 'see no evil', '🙉': 'hear no evil', '🙊': 'speak no evil',
    '💋': 'kiss mark', '💌': 'love letter', '💘': 'cupid', '💝': 'gift heart',
    '💖': 'sparkling heart', '💗': 'heartbeat', '💓': 'beating heart', '💞': 'revolving hearts',
    '💕': 'two hearts', '💟': 'heart decoration', '❣️': 'heart exclamation', '💔': 'broken heart',
    '❤️‍🔥': 'heart fire', '❤️‍🩹': 'mending heart', '❤️': 'red heart', '🩷': 'pink heart',
    '🧡': 'orange heart', '💛': 'yellow heart', '💚': 'green heart', '💙': 'blue heart',
    '🩵': 'light blue heart', '💜': 'purple heart', '🖤': 'black heart', '🩶': 'grey heart',
    '🤍': 'white heart', '🤎': 'brown heart', '💯': 'hundred', '💢': 'anger',
    '💥': 'boom', '💫': 'dizzy star', '💦': 'sweat droplets', '💨': 'dash',
    '🕳️': 'hole', '💣': 'bomb', '💬': 'speech balloon', '👁️‍🗨️': 'eye speech',
    '🗨️': 'left speech', '🗯️': 'right anger', '💭': 'thought balloon', '💤': 'zzz',
    '👋': 'wave', '🤚': 'raised back hand', '🖐️': 'hand splayed', '✋': 'raised hand',
    '🖖': 'vulcan', '🫱': 'rightwards hand', '🫲': 'leftwards hand', '🫳': 'palm down',
    '🫴': 'palm up', '🫷': 'leftwards pushing', '🫸': 'rightwards pushing',
    '👌': 'ok hand', '🤌': 'pinched fingers', '🤏': 'pinching hand', '✌️': 'victory',
    '🤞': 'crossed fingers', '🫰': 'hand with index middle crossed', '🤟': 'love you',
    '🤘': 'rock on', '🤙': 'call me', '👈': 'point left', '👉': 'point right',
    '👆': 'point up', '🖕': 'middle finger', '👇': 'point down', '☝️': 'index up',
    '🫵': 'index pointing at', '👍': 'thumbs up', '👎': 'thumbs down', '✊': 'fist',
    '👊': 'punch', '🤛': 'left fist', '🤜': 'right fist', '👏': 'clap', '🙌': 'raised hands',
    '🫶': 'heart hands', '👐': 'open hands', '🤲': 'palms up', '🤝': 'handshake',
    '🙏': 'pray', '✍️': 'writing', '💅': 'nail polish', '🤳': 'selfie',
    '💪': 'muscle', '🦾': 'mechanical arm', '🦿': 'mechanical leg', '🦵': 'leg',
    '🦶': 'foot', '👂': 'ear', '🦻': 'ear hearing aid', '👃': 'nose', '🧠': 'brain',
    '🫀': 'anatomical heart', '🫁': 'lungs', '🦷': 'tooth', '🦴': 'bone',
    '👀': 'eyes', '👁️': 'eye', '👅': 'tongue', '👄': 'lips', '🫦': 'biting lip',
    '🔥': 'fire', '⭐': 'star', '🌟': 'glowing star', '✨': 'sparkles',
    '🎉': 'party', '🎊': 'confetti', '🎁': 'gift', '🎄': 'christmas tree',
    '🎂': 'birthday', '🍕': 'pizza', '🍔': 'burger', '🍟': 'fries', '🌮': 'taco',
    '🍦': 'ice cream', '🍩': 'donut', '🍪': 'cookie', '☕': 'coffee', '🍺': 'beer',
    '🍷': 'wine', '🍾': 'champagne', '🥂': 'clinking glasses', '🎶': 'musical notes',
    '🎵': 'musical note', '🎤': 'microphone', '🎧': 'headphones', '🎸': 'guitar',
    '⚽': 'soccer', '🏀': 'basketball', '🏈': 'football', '⚾': 'baseball',
    '🎾': 'tennis', '🏐': 'volleyball', '🎱': 'pool', '🏓': 'ping pong',
    '🚗': 'car', '✈️': 'airplane', '🚀': 'rocket', '🌈': 'rainbow', '☀️': 'sun',
    '🌙': 'moon', '⛅': 'partly sunny', '🌧️': 'rain cloud', '❄️': 'snowflake',
    '💐': 'bouquet', '🌹': 'rose', '🌻': 'sunflower', '🌸': 'cherry blossom',
    '🐶': 'dog', '🐱': 'cat', '🐭': 'mouse', '🐹': 'hamster', '🐰': 'rabbit',
    '🦊': 'fox', '🐻': 'bear', '🐼': 'panda', '🐨': 'koala', '🦁': 'lion',
    '🐮': 'cow', '🐷': 'pig', '🐸': 'frog', '🐵': 'monkey', '🐔': 'chicken',
    '🐧': 'penguin', '🐦': 'bird', '🦆': 'duck', '🦅': 'eagle', '🦉': 'owl',
    '🦇': 'bat', '🐺': 'wolf', '🐗': 'boar', '🐴': 'horse', '🦄': 'unicorn',
    '🐝': 'bee', '🐛': 'bug', '🦋': 'butterfly', '🐌': 'snail', '🐞': 'ladybug',
    '🐜': 'ant', '🦟': 'mosquito', '🦗': 'cricket', '🕷️': 'spider', '🦂': 'scorpion',
    '🐢': 'turtle', '🐍': 'snake', '🦎': 'lizard', '🦖': 'dinosaur', '🐙': 'octopus',
    '🦑': 'squid', '🦀': 'crab', '🦐': 'shrimp', '🦞': 'lobster', '🐡': 'blowfish',
    '🐠': 'tropical fish', '🐟': 'fish', '🐬': 'dolphin', '🐳': 'whale', '🦈': 'shark',
    '🐊': 'crocodile', '🐆': 'leopard', '🐅': 'tiger', '🐃': 'water buffalo',
    '🐂': 'ox', '🐄': 'cow face', '🐎': 'racehorse', '🐖': 'pig face', '🐏': 'ram',
    '🐐': 'goat', '🐑': 'sheep', '🐒': 'monkey face', '🐓': 'rooster', '🐕': 'dog2',
    '🐈': 'cat2', '🐿️': 'chipmunk', '🦔': 'hedgehog', '🐉': 'dragon'
  };
  
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
   * WhatsApp uses SPAN elements with data-emoji attribute, NOT img elements!
   */
  async function findAndClickEmoji(emoji) {
    log('Searching for emoji in picker:', emoji);
    
    // WhatsApp emojis are SPAN elements with role="button" and data-emoji attribute
    // Structure: <div role="gridcell" aria-label="😙"><span role="button" data-emoji="😙" class="emojik">
    
    // Method 1: Find by data-emoji attribute (most reliable)
    let emojiSpan = document.querySelector(`span[data-emoji="${emoji}"]`);
    if (emojiSpan && !emojiSpan.closest('[data-balcanize-intercepted]')) {
      log('Found emoji by data-emoji attribute:', emoji);
      return await clickEmojiElement(emojiSpan);
    }
    
    // Method 2: Find by gridcell aria-label
    let gridcell = document.querySelector(`div[role="gridcell"][aria-label="${emoji}"]`);
    if (gridcell && !gridcell.closest('[data-balcanize-intercepted]')) {
      log('Found emoji by gridcell aria-label:', emoji);
      const span = gridcell.querySelector('span[role="button"]');
      if (span) {
        return await clickEmojiElement(span);
      }
      return await clickEmojiElement(gridcell);
    }
    
    // Method 3: Search all emoji spans
    const allEmojiSpans = document.querySelectorAll('span.emojik[role="button"]');
    log('Found', allEmojiSpans.length, 'emoji spans in picker');
    
    for (const span of allEmojiSpans) {
      if (span.closest('[data-balcanize-intercepted]')) continue;
      
      const spanEmoji = span.getAttribute('data-emoji') || span.getAttribute('aria-label');
      if (spanEmoji === emoji) {
        log('Found emoji in span search:', spanEmoji);
        return await clickEmojiElement(span);
      }
    }
    
    // Method 4: Scroll and search
    log('Emoji not found in visible area, scrolling to search...');
    const scrollContainer = findScrollableEmojiContainer();
    
    if (scrollContainer) {
      log('Found scrollable container, searching by scroll...');
      const scrollHeight = scrollContainer.scrollHeight;
      let scrollTop = 0;
      const scrollStep = 200;
      
      while (scrollTop < scrollHeight) {
        scrollContainer.scrollTop = scrollTop;
        await sleep(150);
        
        // Check for emoji after each scroll
        emojiSpan = document.querySelector(`span[data-emoji="${emoji}"]`);
        if (emojiSpan && !emojiSpan.closest('[data-balcanize-intercepted]')) {
          log('Found emoji after scrolling!');
          return await clickEmojiElement(emojiSpan);
        }
        
        scrollTop += scrollStep;
        if (scrollTop > 12000) break; // Safety limit
      }
    }
    
    // Log samples for debugging
    const samples = Array.from(document.querySelectorAll('span[data-emoji]')).slice(0, 10);
    log('Sample emojis found:', samples.map(s => s.getAttribute('data-emoji')).join(', '));
    
    return false;
  }
  
  /**
   * Find the scrollable container for emojis
   */
  function findScrollableEmojiContainer() {
    // Look for the div with x1n2onr6 class that contains emoji grid
    const containers = document.querySelectorAll('div.x1n2onr6');
    for (const div of containers) {
      const style = window.getComputedStyle(div);
      const hasOverflow = style.overflowY === 'scroll' || style.overflowY === 'auto' || 
                          style.overflow === 'auto' || style.overflow === 'scroll';
      const hasEmojis = div.querySelectorAll('span.emojik').length > 5;
      
      if (hasOverflow && hasEmojis) {
        const rect = div.getBoundingClientRect();
        if (rect.height > 100) {
          return div;
        }
      }
    }
    
    // Fallback: find any scrollable container with emojis
    const allDivs = document.querySelectorAll('div');
    for (const div of allDivs) {
      const style = window.getComputedStyle(div);
      const hasOverflow = style.overflowY === 'scroll' || style.overflowY === 'auto';
      const hasEmojis = div.querySelectorAll('span.emojik').length > 10;
      
      if (hasOverflow && hasEmojis) {
        return div;
      }
    }
    
    return null;
  }
  
  /**
   * Click on an emoji element (span or gridcell)
   */
  async function clickEmojiElement(element) {
    log('Clicking emoji element:', element.tagName, element.getAttribute('data-emoji'));
    
    // Scroll into view first
    element.scrollIntoView({ block: 'center', behavior: 'instant' });
    await sleep(100);
    
    // Get the span with role="button" for clicking
    const clickTarget = element.matches('span[role="button"]') ? element : 
                        element.querySelector('span[role="button"]') || element;
    
    // Try multiple click methods
    
    // 1. Native click
    clickTarget.click();
    log('Native click sent');
    
    await sleep(50);
    
    // 2. Simulated click with full event chain
    simulateClick(clickTarget);
    
    // 3. Also click the parent gridcell
    const gridcell = clickTarget.closest('[role="gridcell"]');
    if (gridcell && gridcell !== clickTarget) {
      gridcell.click();
      simulateClick(gridcell);
    }
    
    // 4. Focus and Enter key
    clickTarget.focus();
    clickTarget.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
    clickTarget.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
    
    return true;
  }

  /**
   * Search for emoji using the search box
   */
  async function searchAndClickEmoji(emoji) {
    log('Trying search method for:', emoji);
    
    // Get the emoji name for searching (WhatsApp uses text search, not emoji characters)
    const searchTerm = EMOJI_NAMES[emoji] || emoji;
    log('Search term:', searchTerm, 'for emoji:', emoji);
    
    // Wait for picker to render
    await sleep(300);
    
    // Find the search input - it's an input with role="searchbox" or placeholder containing "Ara" or "Search"
    let searchInput = document.querySelector('input[role="searchbox"]') ||
                      document.querySelector('input[placeholder*="İfade Ara"]') ||
                      document.querySelector('input[placeholder*="Search emoji"]') ||
                      document.querySelector('input._ahyt') ||
                      document.querySelector('input.copyable-text[type="text"]');
    
    if (!searchInput) {
      log('No search input found by primary selectors, searching all inputs...');
      const allInputs = document.querySelectorAll('input[type="text"]');
      for (const input of allInputs) {
        // Skip main chat input
        if (input.closest('[data-testid="conversation-compose-box"]')) continue;
        if (input.getAttribute('data-tab') === '10') continue;
        
        // Look for emoji search specific inputs
        const placeholder = input.getAttribute('placeholder') || '';
        if (placeholder.includes('Ara') || placeholder.includes('Search') || placeholder.includes('emoji')) {
          searchInput = input;
          break;
        }
      }
    }
    
    if (searchInput) {
      log('Found search input:', searchInput.placeholder || searchInput.className);
      
      // Focus and clear
      searchInput.focus();
      await sleep(50);
      searchInput.value = '';
      
      // Type the search term
      searchInput.value = searchTerm;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      log('Typed search term:', searchTerm);
      
      // Wait for search results
      await sleep(800);
      
      // Now try to find and click the emoji from search results
      const found = await findAndClickEmoji(emoji);
      if (found) {
        return true;
      }
      
      // If exact emoji not found, click the first result
      log('Clicking first search result...');
      const firstResult = document.querySelector('span.emojik[role="button"]');
      if (firstResult && !firstResult.closest('[data-balcanize-intercepted]')) {
        return await clickEmojiElement(firstResult);
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
