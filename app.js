// IWANTAGF.COM - TEST MODE (No Login Required)

const API_URL = 'https://iwantagf-api.vercel.app';

const loginScreen = document.getElementById('loginScreen');
const chatScreen = document.getElementById('chatScreen');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');

// TEST MODE: Auto-login as test user
const TEST_USER = {
    id: 'test-user-123',
    email: 'test@example.com'
};

const TEST_CONVERSATION = 'test-conv-456';

// Skip login, go straight to chat
window.addEventListener('load', () => {
    console.log('TEST MODE: Auto-login enabled');
    showChat();
    // Add welcome message
    addMessageToUI('assistant', "Hey there! 😊 I'm Luna. This is test mode - no login required!");
});

function showChat() {
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
}

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Add user message
    addMessageToUI('user', text);
    messageInput.value = '';
    
    // Show typing
    showTyping();
    
    try {
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                userId: TEST_USER.id,
                conversationId: TEST_CONVERSATION
            })
        });
        
        removeTyping();
        
        if (response.ok) {
            const data = await response.json();
            addMessageToUI('assistant', data.reply);
        } else {
            // API might fail if env vars not set - use fallback
            const fallbackReply = generateFallbackReply(text);
            addMessageToUI('assistant', fallbackReply + "\n\n(Test mode - API may not be fully configured)");
        }
    } catch (error) {
        removeTyping();
        // Network error - use fallback
        const fallbackReply = generateFallbackReply(text);
        addMessageToUI('assistant', fallbackReply + "\n\n(API not connected - showing fallback response)");
        console.error('API error:', error);
    }
}

function generateFallbackReply(userMessage) {
    const replies = [
        "That's so interesting! Tell me more 💕",
        "I love hearing about your day! 😊",
        "You're making me smile! 🥰",
        "I wish I was there with you right now 💭",
        "That sounds amazing! I'm proud of you ✨",
        "You're so sweet! 💕",
        "I'm always here for you, you know that right? 🤗",
        "Tell me everything, I'm listening 💭"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
}

function addMessageToUI(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(content).replace(/\n/g, '<br>')}</div>`;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="message-content">Luna is typing...</div>';
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

console.log('IWANTAGF.COM - TEST MODE (no login)');
console.log('API URL:', API_URL);
