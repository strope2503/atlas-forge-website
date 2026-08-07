// ==========================================
// 1. SCROLL REVEAL OBSERVER
// ==========================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));


// ==========================================
// 2. CURSOR GLOW TRACKER
// ==========================================
const glow = document.querySelector('.cursor-glow');
if (glow) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.style.opacity = '1';
  });
}


// ==========================================
// 3. MOBILE NAVIGATION DRAWER TOGGLE
// ==========================================
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});


// ==========================================
// 4. SIGNUP FORM SUBMISSION HANDLER
// ==========================================
document.querySelector('.signup-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  if (button) {
    const originalText = button.textContent;
    button.textContent = 'Submitting...';
    setTimeout(() => {
      button.textContent = 'Success! Routed to Sales';
    }, 1200);
  }
});


// ==========================================
// 5. EMBEDDED ATLAS AI ASSISTANT AGENT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const widgetHTML = `
        <div id="atlasAiContainer" style="position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: inherit;">
            <button id="aiToggleBtn" style="background: #00F0FF; color: #04070D; border: none; width: 56px; height: 56px; border-radius: 50%; box-shadow: 0 0 20px rgba(0,240,255,0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: bold; transition: transform 0.2s;" title="Open Atlas AI Assistant">
                💬
            </button>
            <div id="aiChatBox" style="display: none; width: 350px; height: 480px; background: #0B0F19; border: 1px solid #1E2638; border-radius: 16px; flex-direction: column; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8); margin-bottom: 12px;">
                <div style="background: #04070D; padding: 16px; border-bottom: 1px solid #1E2638; display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #fff; font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                        <span style="width: 8px; height: 8px; background: #00FF66; border-radius: 50%;"></span> Atlas AI Assistant
                    </span>
                    <button id="aiCloseBtn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px;">✕</button>
                </div>
                <div id="aiMessages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; font-size: 13px; color: #cbd5e1;">
                    <div style="background: #1E2638; padding: 10px 14px; border-radius: 8px; max-width: 85%;">
                        Welcome to Atlas Forge! I'm your AI assistant. How can I help you explore Scout Pro V8.0, our hardware tiers, or our $0 recurring subscription model today?
                    </div>
                </div>
                <div style="padding: 12px; border-top: 1px solid #1E2638; background: #04070D; display: flex; gap: 8px;">
                    <input type="text" id="aiInput" placeholder="Ask about Scout Pro, pricing..." style="flex: 1; background: #0B0F19; border: 1px solid #1E2638; padding: 10px; border-radius: 8px; color: #fff; font-size: 13px; outline: none;">
                    <button id="aiSendBtn" style="background: #00F0FF; color: #04070D; border: none; padding: 0 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">Send</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    const toggleBtn = document.getElementById('aiToggleBtn');
    const closeBtn = document.getElementById('aiCloseBtn');
    const chatBox = document.getElementById('aiChatBox');
    const sendBtn = document.getElementById('aiSendBtn');
    const inputField = document.getElementById('aiInput');
    const messagesContainer = document.getElementById('aiMessages');

    toggleBtn.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
        if(chatBox.style.display === 'flex') inputField.focus();
    });

    closeBtn.addEventListener('click', () => {
        chatBox.style.display = 'none';
    });

    function handleUserMessage() {
        const text = inputField.value.trim();
        if(!text) return;

        // Append User Message
        messagesContainer.innerHTML += `<div style="background: #2563eb; color: #fff; padding: 10px 14px; border-radius: 8px; max-width: 85%; align-self: flex-end;">${text}</div>`;
        inputField.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Intelligent Agent Query Logic
        setTimeout(() => {
            let reply = "I can help connect you with our team or provide details on our $2,500 Base package and $3,700 Elite Academy edition. Would you like to schedule a demo?";
            
            const lowerText = text.toLowerCase();
            if(lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('how much')) {
                reply = "Atlas Scout Pro Base Edition is $2,500 and the Elite Academy Edition is $3,700—with $0.00 recurring cloud subscription fees, saving you thousands compared to Veo or Hudl!";
            } else if(lowerText.includes('demo') || lowerText.includes('buy') || lowerText.includes('order')) {
                reply = "You can fill out the demo scheduling form at the bottom of the page, which routes directly to our team at sales@atlasforgetech.com!";
            } else if(lowerText.includes('veo') || lowerText.includes('hudl') || lowerText.includes('competitor')) {
                reply = "Unlike Veo or Hudl which charge massive yearly subscriptions and take 24 hours to process, Atlas Scout Pro runs 100% locally on an NVIDIA Jetson GPU with instant AR highlights and $0 recurring cloud fees.";
            } else if(lowerText.includes('camera') || lowerText.includes('specs') || lowerText.includes('hardware')) {
                reply = "Scout Pro includes 3 high-res cameras, an Apache 5800 rolling hard case with thermal cooling, a 20ft guy-wire mast, a LiFePO4 battery system, and an NVIDIA Jetson Orin Nano GPU!";
            }

            messagesContainer.innerHTML += `<div style="background: #1E2638; padding: 10px 14px; border-radius: 8px; max-width: 85%;">${reply}</div>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
    }

    sendBtn.addEventListener('click', handleUserMessage);
    inputField.addEventListener('keypress', (e) => { 
        if(e.key === 'Enter') handleUserMessage(); 
    });
});