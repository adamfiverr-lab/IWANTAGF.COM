// IWANTAGF.COM - Frontend with Vercel API Integration

// API Configuration
const API_URL = 'https://iwantagf-api.vercel.app';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const chatScreen = document.getElementById('chatScreen');
const loginForm = document.getElementById('loginForm');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');

// State
let currentUser = null;
let currentConversation = null;
let authToken = null;

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_URL}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            authToken = data.session.access_token;
            // Create or get conversation
            currentConversation = 'default-conv-id'; // TODO: Get from backend
            showChat();
            loadHistory();
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Check console.');
    }
});

// Show Chat Screen
function showChat() {
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
}

// Logout
function logout() {
    currentUser = null;
    authToken = null;
    currentConversation = null;
    loginScreen.classList.remove('hidden');
    chatScreen.classList.add('hidden');
}

// Load Conversation History
async function loadHistory() {
    if (!currentConversation) return;
    
    try {
        const response = await fetch(`${API_URL}/api/history?conversationId=${currentConversation}`);
        const data = await response.json();
        
        if (response.ok && data.messages) {
            renderMessages(data.messages);
        }
    } catch (error) {
        console.error('Load history error:', error);
    }
}

// Send Message
async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !currentUser) return;
    
    // Add user message to UI immediately
    addMessageToUI('user', text);
    messageInput.value = '';
    
    // Show typing
    showTyping();
    
    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                message: text,
                userId: currentUser.id,
                conversationId: currentConversation
            })
        });
        
        removeTyping();
        
        const data = await response.json();
        
        if (response.ok) {
            addMessageToUI('assistant', data.reply);
        } else {
            addMessageToUI('assistant', 'Sorry, I had trouble responding. Try again?');
            console.error('Chat error:', data.error);
        }
    } catch (error) {
        removeTyping();
        addMessageToUI('assistant', 'Connection error. Please check your internet.');
        console.error('Send error:', error);
    }
}

// Add Message to UI
function addMessageToUI(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(content)}</div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Render Messages
function renderMessages(messages) {
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
        addMessageToUI(msg.role, msg.content);
    });
}

// Show Typing Indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="message-content">Luna is typing...</div>';
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Remove Typing Indicator
function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

// Scroll to Bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Enter Key Handler
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Initialize
console.log('IWANTAGF.COM loaded');
console.log('API URL:', API_URL);
