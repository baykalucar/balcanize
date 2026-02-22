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
   */
  async function findAndClickEmoji(emoji) {
    log('Searching for emoji in picker:', emoji);
    
    // WhatsApp uses img.emojik for emojis in picker too
    let allEmojiImgs = document.querySelectorAll('img.emojik, img.emoji');
    log('Found', allEmojiImgs.length, 'emoji images in picker');
    
    // Log some details about the images
    const sampleImgs = Array.from(allEmojiImgs).slice(0, 15);
    for (const img of sampleImgs) {
      log('Emoji img:', 'alt=' + img.alt, 'src=' + img.src?.substring(0, 50), 'class=' + img.className);
    }
    
    // First pass: check currently visible emojis
    for (const img of allEmojiImgs) {
      // Skip emojis in our modified buttons
      if (img.closest('[data-balcanize-intercepted]')) {
        continue;
      }
      
      if (img.alt === emoji || img.getAttribute('data-plain-text') === emoji) {
        log('Found emoji image with alt:', img.alt);
        return await clickEmojiImage(img);
      }
    }
    
    // Second pass: scroll through the picker to find the emoji
    log('Emoji not found in visible area, scrolling to search...');
    const scrollContainer = findScrollableEmojiContainer();
    
    if (scrollContainer) {
      log('Found scrollable container:', scrollContainer.tagName, scrollContainer.className?.substring(0, 30));
      
      // Scroll through the container looking for the emoji
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;
      let scrollTop = 0;
      const scrollStep = clientHeight / 2; // Scroll half a page at a time
      
      while (scrollTop < scrollHeight) {
        scrollContainer.scrollTop = scrollTop;
        await sleep(100); // Wait for lazy loading
        
        // Check for emoji after each scroll
        allEmojiImgs = document.querySelectorAll('img.emojik, img.emoji');
        for (const img of allEmojiImgs) {
          if (img.closest('[data-balcanize-intercepted]')) {
            continue;
          }
          if (img.alt === emoji) {
            log('Found emoji after scrolling!', img.alt);
            return await clickEmojiImage(img);
          }
        }
        
        scrollTop += scrollStep;
        
        // Safety limit to avoid infinite loop
        if (scrollTop > 5000) {
          log('Scroll limit reached');
          break;
        }
      }
    }
    
    // Log what we found for debugging
    const sampleAlts = Array.from(allEmojiImgs).slice(0, 10).map(img => img.alt);
    log('Sample alts found:', sampleAlts.join(', '));
    
    return false;
  }
  
  /**
   * Find the scrollable container for emojis
   */
  function findScrollableEmojiContainer() {
    // Look for elements with overflow scroll/auto that contain emojis
    const candidates = document.querySelectorAll('div');
    for (const div of candidates) {
      const style = window.getComputedStyle(div);
      const hasOverflow = style.overflowY === 'scroll' || style.overflowY === 'auto';
      const hasEmojis = div.querySelectorAll('img.emojik').length > 10;
      
      if (hasOverflow && hasEmojis) {
        const rect = div.getBoundingClientRect();
        // Make sure it's visible and reasonably sized
        if (rect.width > 100 && rect.height > 100 && rect.top >= 0) {
          return div;
        }
      }
    }
    
    // Fallback: find container with most emojis
    let bestContainer = null;
    let maxEmojis = 0;
    for (const div of candidates) {
      const emojiCount = div.querySelectorAll('img.emojik').length;
      if (emojiCount > maxEmojis && emojiCount > 10) {
        const rect = div.getBoundingClientRect();
        if (rect.width > 100 && rect.height > 100) {
          maxEmojis = emojiCount;
          bestContainer = div;
        }
      }
    }
    
    return bestContainer;
  }
  
  /**
   * Click on an emoji image
   */
  async function clickEmojiImage(img) {
    // Scroll into view first
    img.scrollIntoView({ block: 'center', behavior: 'instant' });
    await sleep(100);
    
    // Get position after scroll
    const rect = img.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    log('Emoji position:', centerX, centerY);
    
    // Find clickable parent
    const clickable = img.closest('[role="gridcell"]') || 
                     img.closest('[role="button"]') || 
                     img.closest('button') ||
                     img.parentElement;
    
    if (clickable && clickable !== img) {
      log('Clicking wrapper:', clickable.tagName);
      simulateClick(clickable);
    }
    
    // Also click the image directly
    simulateClick(img);
    
    // Try clicking at coordinates
    await sleep(50);
    const elementAtPoint = document.elementFromPoint(centerX, centerY);
    if (elementAtPoint && elementAtPoint !== img) {
      log('Clicking element at point:', elementAtPoint.tagName);
      simulateClick(elementAtPoint);
    }
    
    return true;
  }

  /**
   * Search for emoji if not immediately visible
   */
  async function searchAndClickEmoji(emoji) {
    log('Trying search method for:', emoji);
    
    // Get the emoji name for searching (WhatsApp uses text search, not emoji search)
    const searchTerm = EMOJI_NAMES[emoji] || emoji;
    log('Search term:', searchTerm, 'for emoji:', emoji);
    
    // Wait a bit more for picker to fully render
    await sleep(500);
    
    // Find the emoji picker container - try multiple selectors
    // WhatsApp doesn't always use role="dialog" for the picker
    let pickerContainer = document.querySelector('[role="dialog"]') ||
                          document.querySelector('[data-testid="emoji-picker"]') ||
                          document.querySelector('[aria-label*="Emoji"]') ||
                          document.querySelector('[aria-label*="emoji"]') ||
                          document.querySelector('.emoji-panel') ||
                          document.querySelector('[data-tab="emoji"]');
    
    // If still not found, look for a container that has many emoji images
    if (!pickerContainer) {
      log('No standard picker container found, searching by emoji content...');
      const allContainers = document.querySelectorAll('div');
      for (const container of allContainers) {
        const emojiCount = container.querySelectorAll('img.emojik, img.emoji').length;
        // Look for a container with many emojis that's not the reaction bar
        if (emojiCount > 20 && !container.closest('[data-balcanize-intercepted]')) {
          // Make sure it's a reasonably sized panel
          const rect = container.getBoundingClientRect();
          if (rect.width > 200 && rect.height > 200) {
            pickerContainer = container;
            log('Found picker container by emoji count:', emojiCount);
            break;
          }
        }
      }
    }
    
    if (!pickerContainer) {
      log('No picker container found, listing all elements with emojis...');
      const emojis = document.querySelectorAll('img.emojik');
      if (emojis.length > 0) {
        // Use the parent of the first emoji as container
        let parent = emojis[0].parentElement;
        while (parent && parent !== document.body) {
          const rect = parent.getBoundingClientRect();
          if (rect.width > 200 && rect.height > 200) {
            pickerContainer = parent;
            log('Using emoji parent as container:', parent.tagName, parent.className);
            break;
          }
          parent = parent.parentElement;
        }
      }
    }
    
    if (!pickerContainer) {
      log('Still no picker container found');
      // Fall back to searching entire document
      pickerContainer = document.body;
    }
    
    log('Found picker container:', pickerContainer.tagName, pickerContainer.className?.substring(0, 50));
    
    // Find search input inside the picker - try multiple selectors
    let searchInput = pickerContainer.querySelector('div[contenteditable="true"][role="textbox"]') ||
                      pickerContainer.querySelector('div[contenteditable="true"][data-tab]') ||
                      pickerContainer.querySelector('div[contenteditable="true"]') ||
                      pickerContainer.querySelector('[role="textbox"]') ||
                      pickerContainer.querySelector('input[placeholder*="Search"]') ||
                      pickerContainer.querySelector('input[placeholder*="search"]') ||
                      pickerContainer.querySelector('input[placeholder*="Ara"]') ||
                      pickerContainer.querySelector('input[type="text"]') ||
                      pickerContainer.querySelector('input');
    
    // Also try finding in the whole document if not in picker
    if (!searchInput) {
      log('No search input in picker, trying document-wide search...');
      // Find all textboxes and filter to one in/near emoji area
      const allTextboxes = document.querySelectorAll('[role="textbox"], [contenteditable="true"], input[type="text"]');
      log('Found', allTextboxes.length, 'textboxes in document');
      
      for (const tb of allTextboxes) {
        // Skip the main chat input
        if (tb.closest('[data-testid="conversation-compose-box"]') || 
            tb.closest('.copyable-text') ||
            tb.getAttribute('data-tab') === '10') { // Main chat input often has data-tab="10"
          continue;
        }
        
        // Check if this textbox is near emoji content
        const parent = tb.closest('div');
        if (parent) {
          const rect = tb.getBoundingClientRect();
          log('Textbox:', tb.tagName, 'class:', tb.className?.substring(0, 30), 'pos:', rect.top, rect.left);
          
          // Use the first suitable textbox we find (not main chat)
          if (rect.top > 0 && rect.left > 0) {
            searchInput = tb;
            log('Using textbox as search input');
            break;
          }
        }
      }
    }
    
    if (searchInput) {
      log('Found search input in dialog:', searchInput.tagName, searchInput.className);
      
      // Focus and type the search term (emoji NAME, not emoji character)
      searchInput.focus();
      await sleep(100);
      
      // Clear any existing content first
      if (searchInput.tagName === 'DIV' || searchInput.contentEditable === 'true') {
        searchInput.innerHTML = '';
        searchInput.textContent = '';
      } else if (searchInput.tagName === 'INPUT') {
        searchInput.value = '';
      }
      
      // Type the search term using multiple methods
      document.execCommand('insertText', false, searchTerm);
      searchInput.dispatchEvent(new InputEvent('input', { bubbles: true, data: searchTerm, inputType: 'insertText' }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
      
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
      const pickerStillOpen = document.querySelectorAll('img.emojik').length > 10;
      if (!pickerStillOpen) {
        log('Picker likely closed - reaction probably sent!');
        return true;
      }
      
      // Last resort: try to find and click the first emoji result that's NOT in the search box
      log('Keyboard navigation may have failed, trying direct click...');
      
      // Find emoji images - click first search result
      const emojisInPicker = document.querySelectorAll('img.emojik, img.emoji');
      log('Found', emojisInPicker.length, 'emojis for clicking');
      
      for (const img of emojisInPicker) {
        // Skip if in search input area
        if (img.closest('[role="textbox"]') || img.closest('[contenteditable]')) {
          continue;
        }
        // Skip emojis that are part of the reaction buttons we modified
        if (img.closest('[data-balcanize-intercepted]')) {
          continue;
        }
        
        log('Clicking emoji in picker:', img.alt || 'no-alt');
        img.scrollIntoView({ block: 'center' });
        await sleep(50);
        
        // Try clicking the grid cell or button parent
        const clickable = img.closest('[role="gridcell"]') || 
                         img.closest('[role="button"]') || 
                         img.closest('button') ||
                         img.parentElement;
        if (clickable) {
          log('Clicking wrapper:', clickable.tagName, clickable.className);
          simulateClick(clickable);
        }
        simulateClick(img);
        return true;
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
