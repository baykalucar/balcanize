/**
 * WhatsApp Emoji Customizer - Popup Script
 * Handles emoji selection, ordering, and storage
 */

// Default emojis (WhatsApp's original defaults)
const DEFAULT_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

// Comprehensive emoji list organized by approximate category
const ALL_EMOJIS = [
  // Smileys & Emotion
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊',
  '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋',
  '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
  '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌',
  '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
  '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓',
  '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
  '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
  '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
  '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾',
  '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
  
  // Gestures & Body
  '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞',
  '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
  '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
  '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
  '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅',
  '👄', '💋', '🩸',
  
  // Hearts & Love
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️',
  
  // Celebration & Objects
  '🎉', '🎊', '🎈', '🎁', '🎀', '🏆', '🥇', '🥈', '🥉', '🏅',
  '🎖️', '🎗️', '🎯', '🎮', '🎲', '🎰', '🎭', '🎨', '🎬', '🎤',
  '🎧', '🎵', '🎶', '🎹', '🎸', '🎺', '🎻', '🥁', '📱', '💻',
  '⌨️', '🖥️', '🖨️', '🖱️', '💿', '📀', '📷', '📹', '🎥', '📺',
  '📻', '🎙️', '⏰', '⌚', '📡', '🔋', '🔌', '💡', '🔦', '🕯️',
  
  // Nature & Animals
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔',
  '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴',
  '🦄', '🐝', '🪲', '🐛', '🦋', '🐌', '🐞', '🐜', '🪳', '🦟',
  '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱',
  '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁',
  '🍂', '🍃', '🍄', '🌰', '🦀', '🦞', '🦐', '🦑', '🐙', '🦪',
  
  // Food & Drink
  '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
  '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑',
  '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅',
  '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧇', '🥞', '🧈',
  '🍳', '🥚', '🧀', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔',
  '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗',
  '🥘', '🫕', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪',
  '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧',
  '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫',
  '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖',
  '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃',
  '🍸', '🍹', '🧉', '🍾', '🧊',
  
  // Travel & Places
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
  '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼',
  '🚁', '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛰️',
  '🚢', '⛵', '🛥️', '🚤', '⛴️', '🛳️', '🚂', '🚃', '🚄', '🚅',
  '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪',
  '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌',
  '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄',
  '🌅', '🌆', '🌇', '🌉', '🌌', '🎠', '🎡', '🎢', '💈', '🎪',
  
  // Symbols
  '⭐', '🌟', '✨', '💫', '🔥', '💥', '💢', '💦', '💨', '🕳️',
  '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '🔔', '🔕', '🎵',
  '🎶', '💹', '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌',
  '❎', '➕', '➖', '➗', '✖️', '💲', '💱', '©️', '®️', '™️',
  '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣',
  '8️⃣', '9️⃣', '🔟', '🔢', '🔣', '🔤', '🔡', '🔠', '🔼', '🔽',
  '⬆️', '⬇️', '⬅️', '➡️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️',
  '🔀', '🔁', '🔂', '▶️', '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️',
  '🔼', '⏫', '🔽', '⏬', '⏸️', '⏹️', '⏺️', '⏏️', '🎦', '🔅',
  '🔆', '📶', '📳', '📴', '♀️', '♂️', '⚧️', '✳️', '✴️', '❇️',
  '©️', '®️', '™️', '♾️', '🔚', '🔙', '🔛', '🔜', '🔝'
];

// State
let selectedEmojis = [...DEFAULT_EMOJIS];
let draggedElement = null;
let draggedIndex = null;

// DOM Elements
const selectedEmojisContainer = document.getElementById('selectedEmojis');
const emojiGrid = document.getElementById('emojiGrid');
const searchInput = document.getElementById('emojiSearch');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const toast = document.getElementById('toast');

/**
 * Get localized message with fallback
 */
function getMessage(key, fallback) {
  if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
    const msg = chrome.i18n.getMessage(key);
    return msg || fallback;
  }
  return fallback;
}

/**
 * Localize all elements with data-i18n attributes
 */
function localizeUI() {
  // Localize text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const msg = getMessage(key, el.textContent);
    el.textContent = msg;
  });
  
  // Localize placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const msg = getMessage(key, el.placeholder);
    el.placeholder = msg;
  });
}

/**
 * Initialize the popup
 */
function init() {
  localizeUI();
  loadFromStorage();
  renderSelectedEmojis();
  renderEmojiGrid();
  setupEventListeners();
}

/**
 * Load saved emojis from Chrome storage
 */
function loadFromStorage() {
  chrome.storage.sync.get(['customEmojis'], (result) => {
    if (result.customEmojis && Array.isArray(result.customEmojis)) {
      selectedEmojis = result.customEmojis;
    }
    renderSelectedEmojis();
    renderEmojiGrid();
  });
}

/**
 * Save emojis to Chrome storage
 */
function saveToStorage() {
  chrome.storage.sync.set({ customEmojis: selectedEmojis }, () => {
    showToast(getMessage('savedToast', 'Saved!') + ' ✓');
  });
}

/**
 * Render the selected emojis list
 */
function renderSelectedEmojis() {
  selectedEmojisContainer.innerHTML = '';
  
  selectedEmojis.forEach((emoji, index) => {
    const item = document.createElement('div');
    item.className = 'emoji-item';
    item.draggable = true;
    item.dataset.index = index;
    
    item.innerHTML = `
      <span class="emoji">${emoji}</span>
      <button class="remove-btn" data-index="${index}" title="${getMessage('remove', 'Remove')}">×</button>
    `;
    
    // Drag events
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('drop', handleDrop);
    
    selectedEmojisContainer.appendChild(item);
  });
  
  // Update counter in header if exists
  updateCounter();
}

/**
 * Render available emojis grid
 */
function renderEmojiGrid(filter = '') {
  emojiGrid.innerHTML = '';
  
  const filteredEmojis = filter 
    ? ALL_EMOJIS.filter(emoji => emoji.includes(filter))
    : ALL_EMOJIS;
  
  filteredEmojis.forEach(emoji => {
    const button = document.createElement('button');
    button.className = 'emoji-option';
    button.textContent = emoji;
    button.title = getMessage('clickToAdd', 'Click to add');
    
    if (selectedEmojis.includes(emoji)) {
      button.classList.add('selected');
    }
    
    button.addEventListener('click', () => toggleEmoji(emoji));
    emojiGrid.appendChild(button);
  });
}

/**
 * Toggle emoji selection
 */
function toggleEmoji(emoji) {
  const index = selectedEmojis.indexOf(emoji);
  
  if (index > -1) {
    // Remove emoji
    selectedEmojis.splice(index, 1);
  } else {
    // Add emoji
    selectedEmojis.push(emoji);
  }
  
  renderSelectedEmojis();
  renderEmojiGrid(searchInput.value);
}

/**
 * Remove emoji by index
 */
function removeEmoji(index) {
  selectedEmojis.splice(index, 1);
  renderSelectedEmojis();
  renderEmojiGrid(searchInput.value);
}

/**
 * Update the emoji counter
 */
function updateCounter() {
  const headerTitle = document.querySelector('header h1');
  const existingCounter = headerTitle.querySelector('.counter');
  
  if (existingCounter) {
    existingCounter.textContent = selectedEmojis.length;
  } else {
    const counter = document.createElement('span');
    counter.className = 'counter';
    counter.textContent = selectedEmojis.length;
    headerTitle.appendChild(counter);
  }
}

/**
 * Show toast notification
 */
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 2000);
}

// Drag and Drop Handlers
function handleDragStart(e) {
  draggedElement = e.currentTarget;
  draggedIndex = parseInt(e.currentTarget.dataset.index);
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedElement = null;
  draggedIndex = null;
  
  // Remove any remaining placeholders
  const placeholders = selectedEmojisContainer.querySelectorAll('.placeholder');
  placeholders.forEach(p => p.remove());
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const target = e.currentTarget;
  if (target !== draggedElement && target.classList.contains('emoji-item')) {
    const rect = target.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    
    if (e.clientX < midpoint) {
      target.style.borderLeft = '2px solid #25d366';
      target.style.borderRight = '';
    } else {
      target.style.borderRight = '2px solid #25d366';
      target.style.borderLeft = '';
    }
  }
}

function handleDrop(e) {
  e.preventDefault();
  
  const target = e.currentTarget;
  target.style.borderLeft = '';
  target.style.borderRight = '';
  
  if (target !== draggedElement && target.classList.contains('emoji-item')) {
    const targetIndex = parseInt(target.dataset.index);
    
    // Remove from old position
    const emoji = selectedEmojis.splice(draggedIndex, 1)[0];
    
    // Calculate new position
    const rect = target.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    let newIndex = e.clientX < midpoint ? targetIndex : targetIndex + 1;
    
    // Adjust if dragging from before to after
    if (draggedIndex < targetIndex) {
      newIndex--;
    }
    
    // Insert at new position
    selectedEmojis.splice(newIndex, 0, emoji);
    
    renderSelectedEmojis();
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search input
  searchInput.addEventListener('input', (e) => {
    renderEmojiGrid(e.target.value);
  });
  
  // Save button
  saveBtn.addEventListener('click', saveToStorage);
  
  // Reset button
  resetBtn.addEventListener('click', () => {
    if (confirm(getMessage('confirmReset', 'Are you sure you want to reset to default emojis?'))) {
      selectedEmojis = [...DEFAULT_EMOJIS];
      saveToStorage();
      renderSelectedEmojis();
      renderEmojiGrid(searchInput.value);
    }
  });
  
  // Remove buttons (event delegation)
  selectedEmojisContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const index = parseInt(e.target.dataset.index);
      removeEmoji(index);
    }
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveToStorage();
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
