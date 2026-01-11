document.addEventListener("DOMContentLoaded", function() {
    const chatbotContainer = document.getElementById("chatbot-container");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatBotInput = document.getElementById("chatbot-input");
    const sendBtn = document.getElementById("send-btn");
    const chatbotIcon = document.getElementById("chatbot-icon");
    const closeBtn = document.getElementById("close-btn");

    // 1. Setup Toggle Logic using your .hidden class
    chatbotIcon.addEventListener("click", function() {
        chatbotContainer.classList.remove("hidden");
        chatbotIcon.classList.add("hidden");
    });

    closeBtn.addEventListener("click", function() {
        chatbotContainer.classList.add("hidden");
        chatbotIcon.classList.remove("hidden");
    });

    // 2. Message Sending Logic
    function sendMessage() {
        const userMessage = chatBotInput.value.trim();
        if (userMessage) {
            appendMessage("user", userMessage);
            chatBotInput.value = ""; 
            getBotResponse(userMessage);
        }
    }

    sendBtn.addEventListener("click", sendMessage);
    
    chatBotInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // 3. UI Function to add messages to the screen
    function appendMessage(sender, message) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender);
        msgDiv.textContent = message;
        chatbotMessages.appendChild(msgDiv);
        
        // Auto-scroll to latest message
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // 4. API Call
   async function getBotResponse(userMessage) {
    
    const apikey = "make your api and paste here"; 
    
    const apiurl = "https://api.groq.com/openai/v1/chat/completions";

    try {
        const response = await fetch(apiurl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apikey}`
            },
            body: JSON.stringify({
               
                model: "llama-3.3-70b-versatile", 
                messages: [{role: "user", content: userMessage}]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq Error:", errorData);
            throw new Error("API Connection Failed");
        }

        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        appendMessage("bot", botMessage);
    } catch (error) {
        console.error("Error:", error);
        appendMessage("bot", "Oops! Connection failed. Check console for details.");
    }
}
});