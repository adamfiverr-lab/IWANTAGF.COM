// IWANTAGF.COM - Frontend Logic

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const chatScreen = document.getElementById('chatScreen');
const loginForm = document.getElementById('loginForm');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');

// State
let currentUser = null;
let messages = [
    { role: 'assistant', content: "Hey there! 😊 I've been waiting for you." }
];

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // TODO: Replace with actual Supabase auth
    console.log('Login attempt:', email);
    
    // Mock login success
    currentUser = { email, id: '123' };
    showChat();
});

// Show Chat Screen
function showChat() {
    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    renderMessages();
}

// Logout
function logout() {
    currentUser = null;
    loginScreen.classList.remove('hidden');
    chatScreen.classList.add('hidden');
}

// Send Message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    
    // Add user message
    messages.push({ role: 'user', content: text });
    renderMessages();
    messageInput.value = '';
    
    // Simulate AI typing
    showTyping();
    
    // TODO: Replace with actual API call to backend
    setTimeout(() => {
        removeTyping();
        const reply = generateReply(text);
        messages.push({ role: 'assistant', content: reply });
        renderMessages();
    }, 1500);
}

// Generate Mock Reply (replace with actual AI)
function generateReply(userMessage) {
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

// Show Typing Indicator
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="message-content">Typing...</div>';
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Remove Typing Indicator
function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

// Render Messages
function renderMessages() {
    chatMessages.innerHTML = messages.map(msg => `
        <div class="message ${msg.role === 'user' ? 'user' : 'ai'}">
            <div class="message-content">${msg.content}</div>
        </div>
    `).join('');
    scrollToBottom();
}

// Scroll to Bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enter Key Handler
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Initialize
console.log('IWANTAGF.COM loaded');
console.log('TODO: Connect to Supabase backend');
console.log('TODO: Connect to Replicate LLM');
